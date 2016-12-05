import {Router, Request, Response, NextFunction} from 'express';

const tokenHelpers = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
var util = require('util');

export class UserRouter {
  router: Router


  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Gets a user object for logged in user
   * @param  req Request object
   * @param  res Response object
   * @param  next NextFunction that is called
   * @return 200 JSON of user object
   */
    public getUser(req, res, next) {
      // decode the token
      var header = req.headers.authorization.split(' ');
      var token = header[1];
      tokenHelpers.decodeToken(token, (err, callback) => {
        if(err) {
            res.status(401).json({
            status: 'Token has expired',
            message: 'Your token has expired.'
          });
        } else {
          let user_id = callback.sub;
          var user = toolHelpers.getUserById(user_id)
          .asCallback((err, values) => {
            res.status(200).json({
              status: 'success',
              token: token,
              user: values
            });
          });
        }
      });
    }

    public putUser(req, res, next) {

    }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getUser);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new UserRouter();
authRoutes.init();

export default authRoutes.router;
