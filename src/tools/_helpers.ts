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
  tokenHelper.getUserIdFromRequest(req, (err, user_id, token) => {
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
            message: "You are no longer a member here."
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

/**
* @description Creates a unique group code and returns it
*/
function createGroupCode() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 9; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  //TODO: check that code doesn't already exist in database
  return text;
}


module.exports = {
  getBaseUrl,
  ensureAuthenticated,
};
