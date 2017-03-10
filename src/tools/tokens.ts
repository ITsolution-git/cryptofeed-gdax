const moment = require('moment');
const jwt = require('jwt-simple');
var dotenv = require('dotenv').load();
var util = require('util');

/**
* @description encodes a token based on the user_id
* @param Number ID of user
*/
function encodeToken(user_id: Number) {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user_id
  };
  return jwt.encode(playload, process.env.TOKEN_SECRET);
}

/**
* @description decodes the provided token
* @param String of the token to decode
*/
function decodeToken(token: String, callback) {
  const payload = jwt.decode(token, process.env.TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

/**
* @description returns the user_id based on the headers in the Request
* @param Request object
*/
function getUserIdFromRequest(req, callback) {
  if('authorization' in req.headers) {
    try{
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    this.decodeToken(token, (err, cb) => {
      if(err) {
        callback(err);
      } else {
        callback(null, cb.sub);
      }
    });
    }catch(err){
      callback(err);
    }
  } else {
    callback(new Error("Authentication required"));
  }
}

module.exports = {
  encodeToken,
  decodeToken,
  getUserIdFromRequest
};
