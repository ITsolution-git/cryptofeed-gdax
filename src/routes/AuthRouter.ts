import {Router, Request, Response, NextFunction} from 'express';

const localAuth = require('../auth/local');
const authHelpers = require('../auth/_helpers');
var util = require('util');

export class AuthRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public register(req: Request, res: Response, next: NextFunction) {
    return authHelpers.createUser(req)
    .then((user) => {return localAuth.encodeToken(user[0]); })
    .then((token) => {
      res.status(200).json({
        status: 'success',
        token: token
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error'
      });
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/register', this.register);
  }

}



// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
