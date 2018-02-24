import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';

const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');


import bluebird from 'bluebird';
var util = require('util');
import Customer from '../db/models/customer';

export class CustomerRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public postCustomer(req: IRequest, res: Response, next: NextFunction) {
    
    return new Customer(req.body).save()
    .then((customer) => {        
      res.status(200).json({
        success: 1,
        data: customer
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
    
  }

  public getCustomer(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Customer.where({customer_id:parseInt(req.params.id)}).fetch()
      .then((customer) => {        
        if(customer)
          res.status(200).json({
            success: 1,
            data: customer
          });
        else 
          res.status(404).json({
            success: 0,
            message: "Customer Not Exist"
          });
      })
      .catch(function(err){
        res.status(400).json({
          success: 0,
          message: err.message
        })
      });
    } else {
      res.status(403).json({
        success: 0,
        message: 'Customer ID is required'
      });
    }
  }

  public getCustomers(req: IRequest, res: Response, next: NextFunction) {
    return Customer.where({}).fetchAll()
    .then((customers) => {        
      res.status(200).json({
        success: 1,
        data: customers
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
  }

  public putCustomer(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Customer.where({customer_id:parseInt(req.params.id)}).fetch()
      .then((customer) => {        
        if(customer)
          return customer.save(req.body);
          
        else 
          res.status(404).json({
            success: 0,
            message: "Customer Not Exist"
          });
      })
      .then(function(customer){
        res.status(200).json({
          success: 1,
          data: customer
        });
      })
      .catch(function(err){
        res.status(400).json({
          success: 0,
          message: err.message
        })
      });
    } else {
      res.status(403).json({
        success: 0,
        message: 'Customer ID is required'
      });
    }
  }
  
  public deleteCustomer(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Customer.where({customer_id:parseInt(req.params.id)}).fetch()
      .then((customer) => {        
        if(customer)
          return customer.destroy();
          
        else 
          res.status(404).json({
            success: 0,
            message: "Customer Not Exist"
          });
      })
      .then(function(customer){
        res.status(200).json({
          success: 1,
          message: 'Customer Deleted'
        });
      })
      .catch(function(err){
        res.status(400).json({
          success: 0,
          message: err.message
        })
      });
    } else {
      res.status(403).json({
        success: 0,
        message: 'Customer ID is required'
      });
    }
  }
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {  
    // Routes for /api/v1/user
    this.router.post('/',  this.postCustomer);
    this.router.get('/:id', this.getCustomer);
    this.router.get('/', this.getCustomers);
    this.router.put('/:id', this.putCustomer);
    this.router.delete('/:id', this.deleteCustomer);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const customerRoutes = new CustomerRouter();
customerRoutes.init();

export default customerRoutes;
