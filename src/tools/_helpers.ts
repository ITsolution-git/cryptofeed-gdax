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
 * get distance between (lat1, lon1) and (lat2, lon2) in mile
 */
function getDistanceFromLatLonInMile(lat1,lon1,lat2,lon2) {
  var R = 3959; // Radius of the earth in mile 3959 and km 6371
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in mile
  return d;
}

/**
 * Converts degree to radius
 */
function deg2rad(deg) {
  return deg * (Math.PI/180)
}


/**
* @description Creates a unique group code and returns it
*/
function randomGroupCode() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = {
  getBaseUrl,
  ensureAuthenticated,
  getDistanceFromLatLonInMile,
  randomGroupCode
};
