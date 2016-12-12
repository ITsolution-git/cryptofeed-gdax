import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
const toolHelpers = require('./tools/_helpers');

import GroupRouter from './routes/GroupRouter';
import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';


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
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
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
        status: 'success',
        message: 'Action Now API v1.0'
      });
    });

    this.express.use('/api/v1', router);
    this.express.use('/api/v1/groups', GroupRouter);
    this.express.use('/api/v1/auth', AuthRouter);
    this.express.use('/api/v1/user', toolHelpers.ensureAuthenticated, UserRouter);
  }

}

export default new App().express;
