import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';

const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');


import bluebird from 'bluebird';
var util = require('util');
import Order from '../db/models/order';

export class OrderRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public getOrder(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Order.where({order_id:parseInt(req.params.id)}).fetch()
      .then((order) => {        
        if(order)
          res.status(200).json({
            success: 1,
            data: order
          });
        else 
          res.status(404).json({
            success: 0,
            message: "Order Not Exist"
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
        message: 'Order ID is required'
      });
    }
  }

  public getOrders(req: IRequest, res: Response, next: NextFunction) {
    return Order.where({}).fetchAll()
    .then((orders) => {        
      res.status(200).json({
        success: 1,
        data: orders
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
  }

  public putOrder(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Order.where({order_id:parseInt(req.params.id)}).fetch()
      .then((order) => {        
        if(order)
          return order.save(req.body);
          
        else 
          res.status(404).json({
            success: 0,
            message: "Order Not Exist"
          });
      })
      .then(function(order){
        res.status(200).json({
          success: 1,
          data: order
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
        message: 'Order ID is required'
      });
    }
  }
  
  public deleteOrder(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Order.where({order_id:parseInt(req.params.id)}).fetch()
      .then((order) => {        
        if(order)
          return order.destroy();
          
        else 
          res.status(404).json({
            success: 0,
            message: "Order Not Exist"
          });
      })
      .then(function(order){
        res.status(200).json({
          success: 1,
          message: 'Order Deleted'
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
        message: 'Order ID is required'
      });
    }
  }
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {  
    // Routes for /api/v1/user
    this.router.get('/:id', this.getOrder);
    this.router.get('/', this.getOrders);
    this.router.put('/:id', this.putOrder);
    this.router.delete('/:id', this.deleteOrder);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const orderRoutes = new OrderRouter();
orderRoutes.init();

export default orderRoutes;
