const knex = require('../db/connection');
const bcrypt = require('bcryptjs');
const tokenHelper = require('./tokens');
var util = require('util');

/**
* Inserts user data into database
*/
function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  //TODO: Not returning correct user -- returning doesn't work for mysql
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
* Updates the user record based on JSON array userBody
* @param user_id int id of the user being updatedUser
* @param userBody JSON array of user fields to update
*/
function updateUser(user_id, userBody, callback) {
  knex('user').where({user_id})
    .update(userBody)
    .then(function(count) {
      callback(null, count);
    });
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

/**
* Returns all the groups the user belongs to
* @param user_id id of the user
*/
function getUsersGroups(user_id) {
  //TODO: Need to return creator profile info with the group
  //TODO: Need to return group setting info with the group
  return knex('group')
    .innerJoin('group_user', 'group.group_id', 'group_user.group_id')
    .where('user_id', user_id);
}

/**
* Returns all non-private and non-deleted groups (public call)
*/
function getAllGroups() {
  return knex('group')
    .where({'private':0, 'deleted_at':null});
}

function getOneGroup(group_id) {
  return knex('group')
    .where({group_id}).first();
}

function createGroupCode()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 9; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  //TODO: check that code doesn't already exist in database
  return text;
}

function createGroup(ownerId, req) {
  console.log('CREATE GROUP ************');
  let groupCode = createGroupCode();
  return knex('group')
  .insert({
    created_by_user_id: ownerId,
    name: req.body.name,
    description: req.body.description,
    welcome: req.body.welcome,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    private: req.body.private,
    banner_image_url: req.body.banner_image_url,
    group_code: groupCode
  })
  .returning('*');
  //TODO: not returning correct group -- returning doesn't work with mysql
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUsersGroups,
  updateUser,
  comparePass,
  ensureAuthenticated,
  getAllGroups,
  getOneGroup,
  createGroup
};
