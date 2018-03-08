//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Model Import
import User from '../db/models/user';
import Order from '../db/models/order';
import Customer from '../db/models/customer';
//Validation Import
import AuthValidation from '../validations/AuthValidation';
import NanoValidation from '../validations/NanoValidation';

const moment = require('moment');
const validate = require('../classes/ParamValidator');
//Npm Import
var request = require('request');
var util = require('util');
//Helpers Import
const tokenHelpers = require('../tools/tokens'); 
const AuthHelpers = require('../tools/auth_helpers');
//Smpt Transfer
// import smtpTransport from '../config/smtpTransport';
// const sendgrid = require('../config/config').sendgrid;
// const sghelper = require('sendgrid').mail;

const signer = require('../tools/signer');
const blockchain = require('../tools/blockchain');


declare const btcAud;
declare const btcUsd;
declare const nano;
export class NanoRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public current_price(req: IRequest, res: Response, next: NextFunction) {
    res.json({nano: nano});
  }

  public single_request_payment(req: IRequest, res: Response, next: NextFunction) {

	  let address = signer.generateNewSegwitAddress()
	  let invoiceData:any = {
	    'card_type': 'single',
	    'currency': req.body.currency ? req.body.currency : 'BTC',

	    'message': req.body.message ? req.body.message : '',

	    'exchange_rate': req.body.exchange_rate,
	    'amount': req.body.amount,
	    'card_amount': req.body.card_amount,
	    'discount': req.body.discount,
	    'btc_amount': req.body.btc_amount,

	    'WIF': address.WIF,
	    'address': address.address,
		'status': 'unpaid'
	  }

	  let paymentInfo = {
	    address: invoiceData.address,
	    message: req.body.message,
	    label: 'Btc card',
	    amount: req.body.btc_amount
	  }

	  let answer:any = {
	    'link': signer.URI(paymentInfo),
	    'qr': process.env.BASE_URL_QR + '/generate_qr/' + encodeURIComponent(signer.URI(paymentInfo)),
	    'qr_simple': process.env.BASE_URL_QR + '/generate_qr/' + invoiceData.address,
	    'address': invoiceData.address,
	    'btc_amount': req.body.btc_amount
	  };

		(async function () {
			console.log(req.id, 'created address', invoiceData.address)
			let customer = await new Customer(req.body.customer).save();
			invoiceData.customer_id = customer.get('customer_id');

			let order = await new Order(invoiceData).save()

			answer.customer = customer;
			answer.order = order;


			await blockchain.importaddress(invoiceData.address)

			res.send(answer)
		})().catch((error) => {
			console.log(req.id, error)
			res.send({error: error.message})
		});


  }

  public reload_request_payment(req: IRequest, res: Response, next: NextFunction) {

	  let address = signer.generateNewSegwitAddress()
	  let invoiceData:any = {
	    'card_type': 'single',
	    'currency': req.body.currency ? req.body.currency : 'BTC',

	    'message': req.body.message ? req.body.message : '',

	    'exchange_rate': req.body.exchange_rate,
	    'amount': req.body.amount,
	    'card_amount': req.body.card_amount,
	    'discount': req.body.discount,
	    'btc_amount': req.body.btc_amount,

	    'WIF': address.WIF,
	    'address': address.address,
			'status': 'unpaid'
	  }

	  let paymentInfo = {
	    address: invoiceData.address,
	    message: req.body.message,
	    label: 'Btc card',
	    amount: req.body.btc_amount
	  }

	  let answer:any = {
	    'link': signer.URI(paymentInfo),
	    'qr': process.env.BASE_URL_QR + '/generate_qr/' + encodeURIComponent(signer.URI(paymentInfo)),
	    'qr_simple': process.env.BASE_URL_QR + '/generate_qr/' + invoiceData.address,
	    'address': invoiceData.address,
	    'btc_amount': req.body.btc_amount
	  };

		let userCreated = false, customerCreated = false;
		let user: any;
		let customer: any;
		(async function () {
			console.log(req.id, 'created address', invoiceData.address)

			let token = await tokenHelpers.getUserIdFromRequest(req);
			if(!token.user_id) {
				if (!req.body.user)
					throw new Error('User Object should be set in request');
				
				user = await new User(req.body.user).save();
				userCreated = true;
				req.user = user;
				answer.user = user;
				answer.token = tokenHelpers.encodeToken(req.user.get('user_id'));
				
			} else {
				user = await User.where({user_id: token.user_id}).fetch();
			}

			answer.user = User.getSafeUserFromJS(user);
			
			if(user.get('customer_id')) { //Which mean user has customer fill in
				invoiceData.customer_id = user.get('customer_id');
				customer = await Customer.where({customer_id: user.get('customer_id')}).fetch();
				answer.customer = customer;
			} else {
				customer = await new Customer(req.body.customer).save();
				customerCreated = true;
				user.set('customer_id', customer.get('customer_id'));
				user = await user.save();

				invoiceData.customer_id = customer.get('customer_id');
				answer.customer = customer;
			}

	    console.log(req.id, 'created address', invoiceData.address)

	    let order = await new Order(invoiceData).save()
	    answer.order = order;

	    await blockchain.importaddress(invoiceData.address)

	    res.send(answer)
	  })().catch((error) => {
			(async function () {
				if(customerCreated)
					await customer.destroy();
				if(userCreated)
					await user.destroy();
				console.log(req.id, error)
				res.status(400).send({success: 0, error: error.message})
			})();
	  })
	}


  public check_payment(req: IRequest, res: Response, next: NextFunction) {

	  (async function () {
    	let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
			let order_id = req.params.order_id;
			let order;
			let tryCount = 30;

			while(tryCount) {
				try {
					order = await Order.where({order_id : order_id}).fetch()	
				} catch(err) {
					res.status(500).json(err)
				}
				
				if(!order) {
					res.status(404).json({success: 0, message: "No Order Exist!!"});
					break;
				}
				
				if(order.get('status') == 'paid'){
					res.send({success: 1, order: order});
					break;
				}
					
				if(order.get('status') == 'unpaid' && (moment(order.get('created_at')).isBefore(moment().subtract( process.env.PAID_WATCH_PERIOD_IN_HOURS, 'hours') )) ) {
					res.send({success: 0, message:'The payment request is expired.'});
					break;
				}
					
				tryCount --;
				await wait(3000);
			}
			if(!tryCount)
				res.send({success: 0, message:'Tried 30 Times, Sorry, Payment not proceed yet.'});

	  })().catch((error) => {
	    console.log(req.id, error)
	    res.send({error: error.message})
	  })

	}

//   public payout(req: IRequest, res: Response, next: NextFunction) {
// // router.get('/payout/:seller/:amount/:currency/:address', async function (req, res) {


// 	  (async function () {
// 		  try {
// 		    let btcToPay = req.body.amount
// 		    let order = await Order.where({order_id: req.body.order_id}).fetch()

// 		    if (!order) {
// 		      return res.send(JSON.stringify({'error': 'no such seller'}))
// 		    }

// 		    let responses = await blockchain.listunspent(order.get('address'))
// 		    let amount = 0
// 		    for (const utxo of responses.result) {
// 		      if (utxo.confirmations >= 2) {
// 		        amount += utxo.amount
// 		      }
// 		    }

// 		    if (amount >= btcToPay) { // balance is ok
// 		      let unspentOutputs = await blockchain.listunspent(order.get('address'))
// 		      console.log(req.id, 'sending', btcToPay, 'from', req.params.seller, '(', order.get('address'), ')', 'to', req.body.address)
// 		      let createTx = signer.createTransaction
// 		      if (order.get('address')[0] === '3') {
// 		        // assume source address is SegWit P2SH
// 		        createTx = signer.createSegwitTransaction
// 		      }
// 		      let tx = createTx(unspentOutputs.result, req.params.address, btcToPay, 0.0001, order.get('WIF'), order.get('address'))
// 		      console.log(req.id, 'broadcasting', tx)
// 		      let broadcastResult = await blockchain.broadcastTransaction(tx)
// 		      console.log(req.id, 'broadcast result:', JSON.stringify(broadcastResult))
// 		      let data = {
// 		        'seller': req.body.invoice,
// 		        'btc': btcToPay,
// 		        'tx': tx,
// 		        'transaction_result': broadcastResult,
// 		        'to_address': req.params.address,
// 		        'processed': 'payout_done',
// 		        'timestamp': Date.now(),
// 		        'doctype': 'payout'
// 		      }
// 		      await storage.savePayoutPromise(data)
// 		      res.send(JSON.stringify(broadcastResult))
// 		    } else {
// 		      console.log(req.id, 'not enough balance')
// 		      return res.send({'error': 'not enough balance'})
// 		    }
// 		  } catch (error) {
// 		    console.log(req.id, error)
// 		    return res.send({'error': error.message})
// 		  }
// 		})
// 	}


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/check_payment/:order_id',  this.check_payment);

    this.router.post('/single_card/request_payment', validate (NanoValidation.requestSinglePayment), this.single_request_payment);
    this.router.post('/reload_card/request_payment', validate (NanoValidation.requestReloadPayment), this.reload_request_payment);
    this.router.get('/current_price',  this.current_price);
    
  }

}



// Create the AuthRouter, and export its configured Express.Router
const bitcoinRoutes = new NanoRouter();
bitcoinRoutes.init();

export default bitcoinRoutes;
