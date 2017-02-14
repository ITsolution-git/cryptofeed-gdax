import {Router, Request, Response, NextFunction} from 'express';

const tokenHelpers = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
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

/**
 * Creates new user record in database
 * @param  req Request object
 * @param  res Response object
 * @param  next NextFunction that is called
 * @return 200 JSON of user object
 * TODO: throw error if email or username already exists
 */
  public register(req: Request, res: Response, next: NextFunction) {

    try {
      if(!toolHelpers.validateEmail(req.body.email)) {
        throw Error('Invalid email address');
      }
      if(req.body.password.length < 6) {
        throw Error('Password must be 6 or more characters');
      }
    }
    catch(err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    return toolHelpers.createUser(req)
    .then((user) => { return tokenHelpers.encodeToken(user[0].user_id); })
    .then((token) => {
      res.status(200).json({
        status: 'success',
        token: token
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: 'An error prevented this call from completing.'
      });
    });
  }

 /**
  * Logs the user in. Expects email and password in request object.
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public login(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    return toolHelpers.getUserByEmail(email)
    .then((response) => {
      toolHelpers.comparePass(password, response.password);
      return response;
    })
    .then((response) => {
      return tokenHelpers.encodeToken(response.user_id);
    })
    .then((token) => {
      toolHelpers.getUserByEmail(email)
      .then((user) => {
        res.status(200).json({
          status: 'success',
          token: token,
          user: user
        });
      })
    })
    .catch((err) => {
      res.status(401).json({
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
    this.router.post('/login', this.login);
  }

}



// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
