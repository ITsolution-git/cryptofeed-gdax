import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {IRequest} from './classes/IRequest';

const toolHelpers = require('./tools/_helpers');

import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';
import BitcoinRouter from './routes/BitcoinRouter';
import StaticRouter from './routes/StaticRouter';
import CouponRouter from './routes/CouponRouter';
import CustomerRouter from './routes/CustomerRouter';
import OrderRouter from './routes/OrderRouter';

var fileUpload = require('express-fileupload');

let morgan = require('morgan')
let uuid = require('node-uuid')
let rp = require('request-promise')
morgan.token('id', function getId (req) {
  return req.id
})
var moment = require('moment');
global.btcUsd = 7000 // initial
global.btcAud = 10000


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

require('./bitcoin_test')
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
        btcUsd: global.btcUsd
      });
    });
    this.express.use('/', StaticRouter.router);

    this.express.use('/api/:version', router);
    this.express.use('/api/v1/auth', AuthRouter.router);
    this.express.use('/api/v1/user', toolHelpers.ensureAuthenticated, UserRouter.router);
    this.express.use('/api/v1/bitcoin',  BitcoinRouter.router);
    //CRUD
    this.express.use('/api/v1/coupons', CouponRouter.router);
    this.express.use('/api/v1/customers', CustomerRouter.router);
    this.express.use('/api/v1/orders', OrderRouter.router);

  }

}

export default new App().express;
  