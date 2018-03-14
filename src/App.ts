import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {IRequest} from './classes/IRequest';

const toolHelpers = require('./tools/_helpers');

import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';
import BitcoinRouter from './routes/BitcoinRouter';
import NanoRouter from './routes/NanoRouter';
import StaticRouter from './routes/StaticRouter';
import CouponRouter from './routes/CouponRouter';
import CustomerRouter from './routes/CustomerRouter';
import OrderRouter from './routes/OrderRouter';
import NewsRouter from './routes/NewsRouter';
import AccountRouter from './routes/AccountRouter';

var fileUpload = require('express-fileupload');

let morgan = require('morgan')
let uuid = require('node-uuid')
let rp = require('request-promise')
morgan.token('id', function getId (req) {
  return req.id
})
var moment = require('moment');

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(fileUpload());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(express.static(__dirname + '/../public')); 

    this.express.use(function (req: IRequest, res, next) {
      req.id = uuid.v4()
      next()
    })
    this.express.use(morgan(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'))

    this.express.set('trust proxy', 'loopback')

  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.status(200).json({
        success: 1,
        message: 'Reloadable CARD v1.0',
        lastChange: '02/21/2018 08:25 pm',
        btcAud: global.btcAud,
        btcUsd: global.btcUsd,
        nano: global.nano
      });
    });
    this.express.use('/', StaticRouter.router);

    this.express.use('/api/:version', router);
    this.express.use('/api/v1/auth', AuthRouter.router);
    this.express.use('/api/v1/user', toolHelpers.ensureAuthenticated, UserRouter.router);
    this.express.use('/api/v1/bitcoin',  BitcoinRouter.router);
    this.express.use('/api/v1/nano',  NanoRouter.router);
    
    //CRUD
    this.express.use('/api/v1/coupons', CouponRouter.router);
    this.express.use('/api/v1/customers', CustomerRouter.router);
    this.express.use('/api/v1/orders', OrderRouter.router);
    this.express.use('/api/v1/news', NewsRouter.router);
    this.express.use('/api/v1/account', AccountRouter.router);

    this.express.use(function(req, res, next){
      res.status(404).json({error: 'NOT FOUND'});
    });
  }

}

export default new App().express;
  

global.btcUsd = {
    "data": {
        "code": "USD",
        "name": "US Dollar",
        "rate": 9780.3
    }
}; // initial
global.btcAud = {
    "data": {
        "code": "AUD",
        "name": "Australian Dollar",
        "rate": 12535.41051
    }
};
global.nano = {
    "id": "nano", 
    "name": "Nano", 
    "symbol": "NANO", 
    "rank": "21", 
    "price_usd": "11.3186", 
    "price_btc": "0.001165", 
    "24h_volume_usd": "51009300.0", 
    "market_cap_usd": "1508184086.0", 
    "available_supply": "133248289.0", 
    "total_supply": "133248289.0", 
    "max_supply": "133248290.0", 
    "percent_change_1h": "-3.81", 
    "percent_change_24h": "-11.52", 
    "percent_change_7d": "-29.98", 
    "last_updated": "1520515150", 
    "price_aud": "14.5073099478", 
    "24h_volume_aud": "65379793.0239", 
    "market_cap_aud": "1933074232.0"
};


let updateExchangeRate = async function (pair) {
  let json
  try {
    json = await rp.get({url: 'https://www.bitstamp.net/api/v2/ticker/' + pair, json: true})  
  } catch (err) {
    return console.log(err.message)
  }
  switch (pair) {
    case 'btcusd': global.btcUsd = json.ask; break
  }
}

let updateExchangeRateBitpay = async function (note) {
  let json
  try {
    // json = await rp.get({url: 'https://api.coindesk.com/v1/bpi/currentprice/AUD.json' , json: true})  
    json = await rp.get({url: 'https://bitpay.com/rates/' + note , json: true})  
    
  } catch (err) {
    return console.log(err.message)
  }
  if( note == 'usd')
    global.btcUsd = json;
  else if( note == 'aud' )
    global.btcAud = json;
}

updateExchangeRateBitpay('usd').then(()=>updateExchangeRateBitpay('aud'))
setInterval(() => updateExchangeRateBitpay('usd').then(()=>updateExchangeRateBitpay('aud')), 5 * 60 * 1000)

let updateExchangeRateCoinMarket = async function (note) {
  let json
  try {
    // json = await rp.get({url: 'https://api.coindesk.com/v1/bpi/currentprice/AUD.json' , json: true})  
    json = await rp.get({url: `https://api.coinmarketcap.com/v1/ticker/${note}/?convert=AUD` , json: true})  
    
  } catch (err) {
    return console.log(err.message)
  }
  if( note == 'nano')
    global.nano = json.length > 0 && json[0];
}
updateExchangeRateCoinMarket('nano')
setInterval(() => updateExchangeRateCoinMarket('nano'), 5 * 60 * 1000)


