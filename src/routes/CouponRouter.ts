import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';

const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');
import CouponValidation from '../validations/CouponValidation';

import bluebird from 'bluebird';
var util = require('util');
import Coupon from '../db/models/coupon';

export class CouponRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }


  public postCoupon(req: IRequest, res: Response, next: NextFunction) {
    
    return new Coupon(req.body).save()
    .then((coupon) => {        
      res.status(200).json({
        success: 1,
        data: coupon
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
    
  }

  public getCoupon(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Coupon.where({coupon_id:parseInt(req.params.id)}).fetch()
      .then((coupon) => {        
        if(coupon)
          res.status(200).json({
            success: 1,
            data: coupon
          });
        else 
          res.status(404).json({
            success: 0,
            message: "Coupon Not Exist"
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
        message: 'Coupon ID is required'
      });
    }
  }

  public getCoupons(req: IRequest, res: Response, next: NextFunction) {
    return Coupon.where({}).fetchAll()
    .then((coupons) => {        
      res.status(200).json({
        success: 1,
        data: coupons
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
  }

  public putCoupon(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Coupon.where({coupon_id:parseInt(req.params.id)}).fetch()
      .then((coupon) => {        
        if(coupon)
          return coupon.save(req.body);
          
        else 
          res.status(404).json({
            success: 0,
            message: "Coupon Not Exist"
          });
      })
      .then(function(coupon){
        res.status(200).json({
          success: 1,
          data: coupon
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
        message: 'Coupon ID is required'
      });
    }
  }
  
  public deleteCoupon(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return Coupon.where({coupon_id:parseInt(req.params.id)}).fetch()
      .then((coupon) => {        
        if(coupon)
          return coupon.destroy();
          
        else 
          res.status(404).json({
            success: 0,
            message: "Coupon Not Exist"
          });
      })
      .then(function(coupon){
        res.status(200).json({
          success: 1,
          message: 'Coupon Deleted'
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
        message: 'Coupon ID is required'
      });
    }
  }
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {  
    // Routes for /api/v1/user
    this.router.post('/', validate(CouponValidation.postCoupon), this.postCoupon);
    this.router.get('/:id', this.getCoupon);
    this.router.get('/', this.getCoupons);
    this.router.put('/:id', this.putCoupon);
    this.router.delete('/:id', this.deleteCoupon);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const couponRoutes = new CouponRouter();
couponRoutes.init();

export default couponRoutes;
