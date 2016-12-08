const bcrypt = require('bcryptjs');
const knex = require('../db/connection');
const tokenHelper = require('./tokens');
var util = require('util');

/**
* Inserts user data into database
*/
function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  return knex('user')
  .insert({
    email: req.body.email,
    username: req.body.username,
    password: hash,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    avatar_url: req.body.avatar_url,
    bio: req.body.bio,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  })
  .returning('*');
}

/**
* Returns user data for the specified username
* @param username the username for the account
*/
function getUserByUsername(username) {
  return knex('user').where({username}).first();
}

/**
* Returns user data for the specified email
* @param email the email address for the account
*/
function getUserByEmail(email) {
  return knex('user').where({email}).first();
}

/**
* Returns user data for the specified id
* @param id of the user
*/
function getUserById(user_id) {
  return knex('user').where({user_id}).first();
}

/**
* Returns all the groups the user belongs to
* @param user_id id of the user
*/
function getGroups(user_id) {
  //TODO: Need to return creator profile info with the group
  //TODO: Need to return group setting info with the group
  return knex('group')
    .innerJoin('group_user', 'group.group_id', 'group_user.group_id')
    .where('user_id', user_id);
}

/**
* Compares the given (plain text) password and encrypted password
* @param userPassword plain text password being tested
* @param databasePassword encrypted password to test against
*/
function comparePass(userPassword, databasePassword) {
  const bool = bcrypt.compareSync(userPassword, databasePassword);
  if (!bool) throw new Error('invalid password');
  else return true;
}

/**
* Throws an error if the user is not authenticated
*/
function ensureAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'Authentication required'
    });
  }
  // decode the token
  var header = req.headers.authorization.split(' ');
  var token = header[1];

  tokenHelper.decodeToken(token, (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: 'Token has expired'
      });
    } else {

      // check if the user still exists in the db
      return knex('user').where({user_id: parseInt(payload.sub)}).first()
      .then((user) => {
        next();
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error'
        });
      });
    }
  });
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getGroups,
  comparePass,
  ensureAuthenticated,
};
