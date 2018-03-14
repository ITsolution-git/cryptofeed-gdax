import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
const tokenHelper = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');
import AccountValidation from '../validations/AccountValidation';

import bluebird from 'bluebird';
var util = require('util');
import User from '../db/models/user';
import Customer from '../db/models/customer';

var path = require('path'),
    fs = require('fs');

export class AccountRouter {
  router: Router


  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * @description Gets a user object for logged in user
   * @param  req Request object
   * @param  res Response object
   * @param  next NextFunction that is called
   * @return 200 JSON of user object
   */

  public getAccount(req: IRequest, res: Response, next: NextFunction) {
    if(req.user.get('role') == 'customer'){

      return Customer.where({customer_id:parseInt(req.user.get('customer_id'))})
      // .fetch({
      //   columns: ['user_id',
      //             'created_at',
      //             'updated_at',
      //             'first_name',
      //             'last_name',
      //             'email',
      //             'customer_id',
      //             'role'
      //            ]
      // })
      .fetch().then((customer) => {

        res.status(200).json({
          success: 1,
          user: User.getSafeUserFromJS(req.user),
          customer: customer
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
        user: User.getSafeUserFromJS(req.user)
      });
    }
  }

  /**
  * @description Updates/Saves the current user's information
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */  
  public putAccount(req: IRequest, res: Response, next: NextFunction) {
    let customer = null;
    return req.user.save(req.body.user)
    .then((user) => {
      req.user = user;
      if(req.user.get('role') == 'customer') {
        
        return Customer.where({customer_id:parseInt(req.user.get('customer_id'))})
        .fetch().then((customer) => {
          if(req.body.customer)
            return customer.save(req.body.customer);
          else
            return customer;
        });
      } else {
        return null;
      }
    })
    .then((cus) => {
      customer = cus;
      return tokenHelper.encodeToken(req.user.get('user_id')); 
    })
    .then((token) => {
      let filter = req.user.toJSON();
      delete filter['password'];
      res.status(200).json({
        success: 1,
        token: token,
        user: filter,
        customer: customer,
        message:"Success"
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: 0,
        message:err.message,
        data:err.data,  
        user:{},
        token:""
      });
    });
  }

  public putUserpassword(req: IRequest, res: Response, next: NextFunction) {
    try{
      req.user.authenticate(req.body.original_password);
      
      req.user.save({ 
        password:req.body.new_password })
      .then((user) => {
        req.user = user;
        return tokenHelper.encodeToken(user.get('user_id')); 
      })
      .then((token) => {
        let filter = req.user.toJSON();
        delete filter['password'];
        res.status(200).json({
          success: 1,
          token: token,
          user: filter,
          message:"Success"
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: 0,
          message:err.message,
          data:err.data,
        });
      });
    }catch(err){
      res.status(400).json({
        success: 0,
        message: err.message,
        data: []
      })
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {  
    // Routes for /api/v1/user
    this.router.get('/me',toolHelpers.ensureAuthenticated, this.getAccount);
    this.router.put('/me/password',toolHelpers.ensureAuthenticated, validate(AccountValidation.putUserpassword), this.putUserpassword);
    this.router.put('/me',toolHelpers.ensureAuthenticated, validate(AccountValidation.putAccount), this.putAccount);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const accountRoutes = new AccountRouter();
accountRoutes.init();

export default accountRoutes;
