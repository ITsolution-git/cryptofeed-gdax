const moment = require('moment');
const jwt = require('jwt-simple');
var dotenv = require('dotenv').load();
var util = require('util');

function encodeToken(user_id) {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user_id
  };
  return jwt.encode(playload, process.env.TOKEN_SECRET);
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, process.env.TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

function getUserIdFromRequest(req, callback) {
  if('authorization' in req.headers) {
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    this.decodeToken(token, (err, cb) => {
      if(err) {
        callback(err);
      } else {
        callback(null, cb.sub);
      }
    });
  } else {
    callback("AUTHORIZATION not found");
  }
}

module.exports = {
  encodeToken,
  decodeToken,
  getUserIdFromRequest
};
