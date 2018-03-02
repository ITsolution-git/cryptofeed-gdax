import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
import bookshelf from '../db/bookshelf';
const bcrypt = require('bcryptjs');
const tokenHelper = require('./tokens');
var util = require('util');
import User from '../db/models/user';


/**
* @description Get Base uri of current api call
* @param req: Request request object containing uri information
*/
function getBaseUrl(req: Request) {
  let base =  req.secure ? 'https' : 'http';
  base += '://' + req.headers['host'].toString();
  base += '/';
  return base;
}
/**
* @description Throws an error if the user is not authenticated
* @param req: Request
* @param res: Response
* @param next: Callback function (NextFunction)
*/
function ensureAuthenticated(req: IRequest, res: Response, next: NextFunction) {
  tokenHelper.getUserIdFromRequest(req)
  .then(({err, user_id}) => {
    if(err) {
        res.status(401).json({
        success: 0,
        message: err.message
        // message: "Expired or wrong token"
      });
    } else {
      // check if the user still exists in the db
      return User.where({user_id: user_id}).fetch()
      .then((user) => {
        if(user == null)
        {
          res.status(400).json({
            success: 0,
            message: "Token Invalid"
          });
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(401).json({
          success: 0,
          message: err.message
        });
      });
    }
  });
}

function isAdmin(req: IRequest, res: Response, next: NextFunction) {
  if(req.user.get('role') == 'admin')
    next();
  else
    res.status(401).json({
      success: 0,
      message: "You are not Admin. Not Allowed to log here."
    });
}

/**
* @description Returns true or false according to whether user is authenticated or not.
* @param req: Request
* @param res: Response
* @param next: Callback function (NextFunction)
*/
function isAuthenticated(req: IRequest) {
  return tokenHelper.getUserIdFromRequest(req)
  .then(({err, user_id}) => {
    if(err) {
      return false;
    } else {
      // check if the user still exists in the db
      return User.where({user_id: user_id}).fetch()
      .then((user) => {
        if(user == null)
          return false;
        req.user = user;
        return user;
      })
      .catch((err) => {
        return false;
      });
    }
  });
}



module.exports = {
  getBaseUrl,
  ensureAuthenticated,
  isAuthenticated,
  isAdmin
};
