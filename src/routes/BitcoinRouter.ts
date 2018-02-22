//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Model Import
import User from '../db/models/user';
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
    res.json(btcAud.bpi);
  }

  public request_payment(req: IRequest, res: Response, next: NextFunction) {
    let exchangeRate, btcToAsk, satoshiToAsk

	  switch (req.params.currency) {
	    case 'BTC': exchangeRate = 1
	      break
	    default:
	      return res.send(JSON.stringify({'error': 'bad currency'}))
	  }

	  satoshiToAsk = Math.floor((req.params.expect / exchangeRate) * 100000000)
	  btcToAsk = satoshiToAsk / 100000000

	  let address = signer.generateNewSegwitAddress()

	  let addressData = {
	    'timestamp': Date.now(),
	    'expect': req.params.expect,
	    'currency': req.params.currency,
	    'exchange_rate': exchangeRate,
	    'btc_to_ask': btcToAsk,
	    'message': req.params.message,
	    'seller': req.params.seller,
	    'customer': req.params.customer,
	    'callback_url': decodeURIComponent(req.params.callback_url),
	    'WIF': address.WIF,
	    'address': address.address,
	    'doctype': 'address',
	    '_id': address.address
	  }

	  let paymentInfo = {
	    address: addressData.address,
	    message: req.params.message,
	    label: req.params.message,
	    amount: satoshiToAsk
	  }

	  let answer = {
	    'link': signer.URI(paymentInfo),
	    'qr': process.env.BASE_URL_QR + '/generate_qr/' + encodeURIComponent(signer.URI(paymentInfo)),
	    'qr_simple': process.env.BASE_URL_QR + '/generate_qr/' + addressData.address,
	    'address': addressData.address
	  };

	  (async function () {
	    console.log(req.id, 'checking seller existance...')
	    let responseBody = await storage.getSellerPromise(req.params.seller)

	    if (typeof responseBody.error !== 'undefined') { // seller doesnt exist
	      console.log(req.id, 'seller doesnt exist. creating...')
	      let address = signer.generateNewSegwitAddress()
	      let sellerData = {
	        'WIF': address.WIF,
	        'address': address.address,
	        'timestamp': Date.now(),
	        'seller': req.params.seller,
	        '_id': req.params.seller,
	        'doctype': 'seller'
	      }
	      console.log(req.id, 'created', req.params.seller, '(', sellerData.address, ')')
	      await storage.saveSellerPromise(req.params.seller, sellerData)
	      await blockchain.importaddress(sellerData.address)
	    } else { // seller exists
	      console.log(req.id, 'seller already exists')
	    }

	    console.log(req.id, 'created address', addressData.address)
	    await storage.saveAddressPromise(addressData)
	    await blockchain.importaddress(addressData.address)

	    res.send(JSON.stringify(answer))
	  })().catch((error) => {
	    console.log(req.id, error)
	    res.send(JSON.stringify({error: error.message}))
	  })
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/request_payment/:expect/:currency/:message/:seller/:customer/:callback_url',  this.request_payment);
    this.router.get('/current_price',  this.current_price);
    
  }

}



// Create the AuthRouter, and export its configured Express.Router
const bitcoinRoutes = new BitcoinRouter();
bitcoinRoutes.init();

export default bitcoinRoutes;
