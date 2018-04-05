import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {IRequest} from './classes/IRequest';

const toolHelpers = require('./tools/_helpers');

// import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';
import TradeRouter from './routes/TradeRouter'

var fileUpload = require('express-fileupload');

let morgan = require('morgan')
let uuid = require('node-uuid')
let rp = require('request-promise')
morgan.token('id', function getId (req) {
  return req.id
})
var moment = require('moment');
global.tradeCron = true;

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

    this.express.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
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
        message: 'collectmarketcap',
        lastChange: '04/06/2018 08:25 pm'
      });
    });

    this.express.use('/api/:version', router);
    // this.express.use('/api/v1/auth', AuthRouter.router);
    // this.express.use('/api/v1/user', toolHelpers.ensureAuthenticated, UserRouter.router);
    this.express.use('/api/v1/trade',  TradeRouter.router);
    
    this.express.use(function(req, res, next){
      res.status(404).json({error: 'NOT FOUND'});
    });
  }

}

export default new App().express;
  