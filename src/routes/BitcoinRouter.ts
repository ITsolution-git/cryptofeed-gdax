//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Model Import
import User from '../db/models/user';
import Order from '../db/models/order';
//Validation Import
import AuthValidation from '../validations/AuthValidation';
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

declare const storage;
declare const btcAud;
declare const btcUsd;
export class BitcoinRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public current_price(req: IRequest, res: Response, next: NextFunction) {
    res.json({btcAud: btcAud, btcUsd: btcUsd});
  }

  public request_payment(req: IRequest, res: Response, next: NextFunction) {
    let exchangeRate, btcToAsk, satoshiToAsk
    let customer_id = req.body.customer_id;

	  switch (req.body.currency) {
	    case 'BTC': exchangeRate = 1
      	break
	    default:
	    	req.body.currency = 'BTC';
	    	exchangeRate = 1
	      break;
	  }

	  satoshiToAsk = Math.floor((req.body.expect / exchangeRate) * 100000000)
	  btcToAsk = satoshiToAsk / 100000000

	  let address = signer.generateNewSegwitAddress()

	  let invoiceData = {
	    'customer_id': customer_id,
	    'currency': req.body.currency,
	    'exchange_rate': exchangeRate,

	    'btc_amount': btcToAsk,
	    'message': req.body.message,
	    'callback_url': decodeURIComponent(req.body.callback_url),
	    'WIF': address.WIF,
	    'address': address.address
	  }

	  let paymentInfo = {
	    address: invoiceData.address,
	    message: req.body.message,
	    label: req.body.message,
	    amount: satoshiToAsk
	  }

	  let answer = {
	    'link': signer.URI(paymentInfo),
	    'qr': process.env.BASE_URL_QR + '/generate_qr/' + encodeURIComponent(signer.URI(paymentInfo)),
	    // 'qr_simple': process.env.BASE_URL_QR + '/generate_qr/' + invoiceData.address,
	    'address': invoiceData.address,
	    'amount': btcToAsk,
	    'order_id': 0
	  };

	  (async function () {
	    // console.log(req.id, 'checking seller existance...')
	    // if (typeof responseBody.error !== 'undefined') { // seller doesnt exist
	    //   console.log(req.id, 'seller doesnt exist. creating...')
	    //   let address = signer.generateNewSegwitAddress()
	    //   let sellerData = {
	    //     'WIF': address.WIF,
	    //     'address': address.address,
	    //     'timestamp': Date.now(),
	    //     'seller': req.body.seller,
	    //     '_id': req.body.seller,
	    //     'doctype': 'seller'
	    //   }
	    //   console.log(req.id, 'created', req.body.seller, '(', sellerData.address, ')')
	    //   await storage.saveSellerPromise(req.body.seller, sellerData)
	    //   await blockchain.importaddress(sellerData.address)
	    // } else { // seller exists
	    //   console.log(req.id, 'seller already exists')
	    // }

	    console.log(req.id, 'created address', invoiceData.address)

	    let order = await new Order(invoiceData).save()
	    answer.order_id = order.id;

	    await blockchain.importaddress(invoiceData.address)

	    res.send(answer)
	  })().catch((error) => {
	    console.log(req.id, error)
	    res.send({error: error.message})
	  })
  }

  public check_payment(req: IRequest, res: Response, next: NextFunction) {

	  (async function () {
		  let order_id = req.params.order_id;
		  let order;
		  try {
		  	order = await Order.where({order_id : order_id}).fetch()
		  } catch(err) {
		  	res.status(500).json(err)
		  }
		  
		  try {

		  	let received = await blockchain.getreceivedbyaddress(order.get('address'))
	      let answer = {
	        'btc_expected': order.get('btc_amount'),
	        'btc_actual': received[1].result,
	        'btc_unconfirmed': received[0].result
	      }
	      res.send(JSON.stringify(answer))
		  } catch(err) {
		  	console.log(err);
		  	res.status(500).json(err)
		  }

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

    this.router.post('/request_payment',  this.request_payment);
    this.router.get('/current_price',  this.current_price);
    
  }

}



// Create the AuthRouter, and export its configured Express.Router
const bitcoinRoutes = new BitcoinRouter();
bitcoinRoutes.init();

export default bitcoinRoutes;
