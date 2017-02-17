import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest'

const tokenHelpers = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
var util = require('util');
import User from '../db/models/user';

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
 * TODO: throw error if email or username already exists : Done
 */
  public register(req: IRequest, res: Response, next: NextFunction) {

    let validationMsg = [];
    try {
      if(!toolHelpers.validateEmail(req.body.email)) {
        validationMsg.push('Invalid email address');
      }
      if(req.body.password.length < 6) {
        validationMsg.push('Password must be 6 or more characters');
      }
      User.where({email:req.body.email}).fetch().then(function(user){
        if(user != null)
          validationMsg.push('Choose other email');
        User.where({username:req.body.username}).fetch().then(function(user){
          if(user != null)
            validationMsg.push('Choose other username');
        });
        
      });
    }
    catch(err) {
      return res.status(400).json({
        success: 0,
        message: [err.message]
      });
    }
    if(validationMsg.length != 0){
      return res.status(400).json({
        success: 0,
        message: validationMsg
      });
    }
    
    return User.createUser(req.body)
    .then((user) => {
      req.user = user;
      return tokenHelpers.encodeToken(user.get('user_id')); 
    })
    .then((token) => {
      res.status(200).json({
        success: 1,
        user: req.user,
        token: token
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: 0,
        message: err.message
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
  public login(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    return User.where({email : email}).fetch()
    .then((user) => {
      user.authenticate(password);
      req.user = user;
      return user;
    })
    .then((response) => {
      return tokenHelpers.encodeToken(response.user_id);
    })
    .then((token) => {
      res.status(200).json({
        success: 1,
        token: token,
        user: req.user
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: 0,
        message: "Login failed"
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
