//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Model Import
import User from '../db/models/user';
import IdexTrade from '../db/models/idex_trade';
import BittrexTrade from '../db/models/bittrex_trade';
//Validation Import
import TradeValidation from '../validations/TradeValidation';

const moment = require('moment');
const validate = require('../classes/ParamValidator');
//Npm Import
var request = require('request');
const rp = require('request-promise');
//Helpers Import
const tokenHelpers = require('../tools/tokens'); 
const AuthHelpers = require('../tools/auth_helpers');
//Smpt Transfer
// import smtpTransport from '../config/smtpTransport';
// const sendgrid = require('../config/config').sendgrid;
// const sghelper = require('sendgrid').mail;


export class TradeRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public getIdexMarkets(req: IRequest, res: Response, next: NextFunction) {
		(async function () {

      var options = {
        method: 'POST',
        uri: 'https://api.idex.market/returnTicker',
        body: {
        },
        json: true // Automatically stringifies the body to JSON
      };
      let markets = await rp(options);
      // let count = await Trade.count('id as count');
	    res.send({markets:Object.keys(markets)});
	  })().catch((error) => {
			res.status(400).send({success: 0, error: error.message})
	  })
	}
  public getIdexTrades(req: IRequest, res: Response, next: NextFunction) {
		(async function () {

	    let trades = await IdexTrade.query(function(qb) {
	      if(req.query.market) qb.where('market', '=', req.query.market)
	      if(req.query.start) qb.where('timestamp', '>=', req.query.start)
	      if(req.query.end) qb.where('timestamp', '<=', req.query.end)

	    }).fetchAll();

	    res.send(trades)
	  })().catch((error) => {
			res.status(400).send({success: 0, error: error.message})
	  })
	}




  public getBittrexMarkets(req: IRequest, res: Response, next: NextFunction) {
    (async function () {

      var options = {
        method: 'POST',
        uri: 'https://api.idex.market/returnTicker',
        body: {
        },
        json: true // Automatically stringifies the body to JSON
      };
      let markets = await rp(options);
      // let count = await Trade.count('id as count');
      res.send({markets:Object.keys(markets)});
    })().catch((error) => {
      res.status(400).send({success: 0, error: error.message})
    })
  }
  public getBittrexTrades(req: IRequest, res: Response, next: NextFunction) {
    (async function () {

      let trades = await BittrexTrade.where({}).fetchAll();
      res.send(trades)
    })().catch((error) => {
      res.status(400).send({success: 0, error: error.message})
    })
  }

  public getCronStatus(req: IRequest, res: Response, next: NextFunction) {
		res.status(200).send({success: 1, tradeCron: global.tradeCron})
	}


  public setCronStatus(req: IRequest, res: Response, next: NextFunction) {
		global.tradeCron = req.query.tradeCron == 'true' ? true : false;
		res.status(200).send({success: 1, tradeCron: req.query.tradeCron})  
	}

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/getCronStatus',  this.getCronStatus);
    this.router.get('/setCronStatus',  this.setCronStatus);
    this.router.get('/idex/markets',  this.getIdexMarkets);
    this.router.get('/idex/trades',  this.getIdexTrades);
    
    this.router.get('/bittrex/markets',  this.getBittrexMarkets);
    this.router.get('/bittrex/trades',  this.getBittrexTrades);

    
  }

}



// Create the AuthRouter, and export its configured Express.Router
const tradeRoutes = new TradeRouter();
tradeRoutes.init();

export default tradeRoutes;
