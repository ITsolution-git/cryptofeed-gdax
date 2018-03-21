//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Model Import
import User from '../db/models/user';
import Customer from '../db/models/customer';

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
    return new User({...req.body, role: req.body.role ? req.body.role : 'customer'}).save()
    .then((user) => {
      req.user = user;
      return tokenHelpers.encodeToken(req.user.get('user_id'));
    })
    .then((token) => {
      let cus = null;
      if(req.user.get('role') == 'customer'){
        let bodyForCustomer = req.body;
        delete bodyForCustomer.password;
        delete bodyForCustomer.role;
        delete bodyForCustomer.google_id;
        delete bodyForCustomer.facebook_id;

        return new Customer(bodyForCustomer).save().then(customer=>{
          cus = customer;
          req.user.set('customer_id', customer.get('customer_id'));
          return req.user.save()
        }).then((customer)=>{

          res.status(200).json({
            success: 1,
            user: User.getSafeUserFromJS(req.user),
            customer: cus,
            token: token
          }); 
        });
      } else {

        res.status(200).json({
          success: 1,
          user: User.getSafeUserFromJS(req.user),
          token: token
        }); 
      }
    })
    .catch((err) => {
      if(req.user) {
        req.user.destroy();
      }
      res.status(400).json({
        success: 0,
        message: err.message,
        data: err.data,
        user: {},
        token: "",
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
      if(!user)
        throw Error("Invalid email address");
      user.authenticate(password);
      req.user = user;
      return user;
    })
    .then((response) => {
      return tokenHelpers.encodeToken(response.id);
    })
    .then((token) => {

      if(req.user.get('role') == 'customer'){

        return Customer.where({customer_id:parseInt(req.user.get('customer_id'))})
        .fetch().then((customer) => {

          res.status(200).json({
            success: 1,
            user: User.getSafeUserFromJS(req.user),
            customer: customer,
            token: token,
          });
        })
        .catch(function(err){
          res.status(400).json({
            success: 0,
            message: err.message
          })
        });
      } else {
        res.status(200).json({
          success: 1,
          user: User.getSafeUserFromJS(req.user),
          token: token,
        });
      }
    })
    .catch((err) => {
      res.status(401).json({
        success: 0,
        user: {},
        token: "",
        data: err.data,
        message: err.message
      });
    });
  }

 /**
  * Logs the user in. Expects email in request object.
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public loginFacebook(req: IRequest, res: Response, next: NextFunction) {
    const facebook_id = req.body.facebook_id;
    return User.where({facebook_id : facebook_id}).fetch()
    .then((user) => {
      if(!user){
        console.log('Creating User from ', req.body);

        return new User({...req.body, role: req.body.role ? req.body.role : 'customer'}).save()
        .then((user) => {
          req.user = user;
          return tokenHelpers.encodeToken(req.user.get('user_id'));
        })
        .then((token) => {
          let cus = null;
          if(req.user.get('role') == 'customer'){
            let bodyForCustomer = req.body;
            delete bodyForCustomer.password;
            delete bodyForCustomer.role;
            delete bodyForCustomer.facebook_id;
            delete bodyForCustomer.google_id;

            return new Customer(bodyForCustomer).save().then(customer=>{
              cus = customer;
              req.user.set('customer_id', customer.get('customer_id'));
              return req.user.save()
            }).then((customer)=>{
              return req.user;
            });
          } else {
            return req.user;
          }
        })
      }

      if (!user.get('facebook_id')) {
        throw new Error('You are not authorized via facebook');
      }
      req.user = user;
      return user;
    })
    .then((response) => {
      return tokenHelpers.encodeToken(response.id);
    })
    .then((token) => {
      
      if(req.user.get('role') == 'customer'){

        return Customer.where({customer_id:parseInt(req.user.get('customer_id'))})
        .fetch().then((customer) => {

          res.status(200).json({
            success: 1,
            user: User.getSafeUserFromJS(req.user),
            customer: customer,
            token: token,
          });
        })
        .catch(function(err){
          res.status(400).json({
            success: 0,
            message: err.message
          })
        });
      } else {
        res.status(200).json({
          success: 1,
          user: User.getSafeUserFromJS(req.user),
          token: token,
        });
      }
    })
    .catch((err) => {
      if(req.user) {
        req.user.destroy();
      }
      res.status(401).json({
        success: 0,
        user: {},
        token: "",
        data: err.data,
        message: err.message
      });
    });
  }

 /**
  * Logs the user in. Expects email in request object.
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public loginGoogle(req: IRequest, res: Response, next: NextFunction) {
    const google_id = req.body.google_id;
    return User.where({google_id : google_id}).fetch()
    .then((user) => {
      if(!user){
        console.log('Creating User from ', req.body);

        return new User({...req.body, role: req.body.role ? req.body.role : 'customer'}).save()
        .then((user) => {
          req.user = user;
          return tokenHelpers.encodeToken(req.user.get('user_id'));
        })
        .then((token) => {
          let cus = null;
          if(req.user.get('role') == 'customer'){
            let bodyForCustomer = req.body;
            delete bodyForCustomer.password;
            delete bodyForCustomer.role;
            delete bodyForCustomer.facebook_id;
            delete bodyForCustomer.google_id;

            return new Customer(bodyForCustomer).save().then(customer=>{
              cus = customer;
              req.user.set('customer_id', customer.get('customer_id'));
              return req.user.save()
            }).then((customer)=>{
              return req.user;
            });
          } else {
            return req.user;
          }
        })
      }
      if (!user.get('google_id')) {
        throw new Error('You are not authorized via google');
      }
      req.user = user;
      return user;
    })
    .then((response) => {
      return tokenHelpers.encodeToken(response.id);
    })
    .then((token) => {
      
      if(req.user.get('role') == 'customer'){

        return Customer.where({customer_id:parseInt(req.user.get('customer_id'))})
        .fetch().then((customer) => {

          res.status(200).json({
            success: 1,
            user: User.getSafeUserFromJS(req.user),
            customer: customer,
            token: token,
          });
        })
        .catch(function(err){
          res.status(400).json({
            success: 0,
            message: err.message
          })
        });
      } else {
        res.status(200).json({
          success: 1,
          user: User.getSafeUserFromJS(req.user),
          token: token,
        });
      }
    })
    .catch((err) => {
      if(req.user) {
        req.user.destroy();
      }
      res.status(401).json({
        success: 0,
        user: {},
        token: "",
        data: err.data,
        message: err.message
      });
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/register', validate(AuthValidation.register), this.register);
    this.router.post('/login', validate(AuthValidation.login), this.login);
    this.router.post('/facebook/login', validate(AuthValidation.loginFacebook), this.loginFacebook);
    this.router.post('/google/login', validate(AuthValidation.loginGoogle), this.loginGoogle);
    
  }

}



// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes;
