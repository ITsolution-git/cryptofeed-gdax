import {Router, Request, Response, NextFunction} from 'express';
const knex = require('../db/connection');
const bcrypt = require('bcryptjs');
const tokenHelper = require('./tokens');
var util = require('util');


/***************************************************************/
/**  User Functions **/
/***************************************************************/

/**
* @description Inserts user data into database
* @param Request
*/
function createUser(req: Request) {
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
* @description Returns user data for the specified username
* @param String the username for the account
*/
function getUserByUsername(username: String) {
  return knex('user').where({username}).first();
}

/**
* @description Returns user data for the specified email
* @param String the email address for the account
*/
function getUserByEmail(email: String) {
  return knex('user').where({email}).first();
}

/**
* @description Returns user data for the specified id
* @param Int id of the user
*/
function getUserById(user_id: String) {
  return knex('user').where({user_id}).first();
}

/**
* @description Updates the user record based on JSON array userBody
* @param Int id of the user being updatedUser
* @param JSON array of user fields to update
*/
function updateUser(user_id: Number, userBody: JSON, callback) {
  knex('user').where({user_id})
    .update(userBody)
    .then(function(count) {
      callback(null, count);
    });
}

/**
* @description Compares the given (plain text) password and encrypted password
* @param userPassword plain text password being tested
* @param databasePassword encrypted password to test against
*/
function comparePass(userPassword: String, databasePassword: String) {
  const bool = bcrypt.compareSync(userPassword, databasePassword);
  if (!bool) throw new Error('invalid password');
  else return true;
}

/**
* @description Throws an error if the user is not authenticated
* @param Request
* @param Response
* @param Callback function (NextFunction)
*/
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  tokenHelper.getUserIdFromRequest(req, (err, user_id, token) => {
    if(err) {
        res.status(400).json({
        status: 'Authentication required',
        message: 'Your token has expired.'
      });
    } else {
      // check if the user still exists in the db
      return knex('user').where({user_id: user_id}).first()
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

/***************************************************************/
/**  Group Functions **/
/***************************************************************/

/**
* @description Returns all the groups the user belongs to
* @param Number id of the user
*/
function getUsersGroups(user_id: Number) {
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

/**
* @description Returns a single group as specified by group_id
* @param Number ID of the group to return
*/
function getGroupById(group_id: Number) {
  return knex('group')
    .select('*').where({group_id}).first();
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

/**
* @description Creates a new group based on owner and request params
* @param Number user_id of person creating group
* @param Request object
*/
function createGroup(ownerId: Number, req: Request) {
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
  .returning('group_id');
}

/**
* @description Updates group details
* @param Number ID of the group
* @param JSON array of group data being updated
* @param callback function
*/
function updateGroup(group_id: Number, groupBody: JSON, callback) {
  knex('group').where({group_id})
    .update(groupBody)
    .then(function(count) {
      callback(null, count);
    });
}

/**
* @description Allows user to join group
* @param Number ID of the group
* @param Number ID of the user joining the group
* @param callback function
*/
function joinGroup(group_id: Number, user_id: Number, callback) {
  knex('group_user')
  .insert({
    group_id: group_id,
    user_id: user_id,
    admin_settings: 0,
    admin_members: 0,
    mod_actions: 0,
    mod_comments: 0,
    submit_action: 0,
    banned: 0
  })
  .then(callback());
}

/**
* @description Returns array of group members
* @param Number ID of the group
* @param callback function
*/
function getGroupMembers(group_id: Number, callback) {
  knex('user').select('user.user_id', 'user.username', 'user.avatar_url').from('user')
  .innerJoin('group_user', 'user.user_id', 'group_user.user_id')
  .where('group_id', group_id)
  .asCallback(function(err, values) {
    callback(err, values);
  });
}

/***************************************************************/
/**  Group Action Functions **/
/***************************************************************/

/**
* @description returns all non-deleted actions for specified group_id
* @param group_id int id of group
*/
function getGroupActions(group_id) {
  knex('action')
    .innerJoin('action_type', 'action.action_type_id', 'action_type.action_type_id')
    .where({'action.group_id':group_id, 'action.deleted_at':null}).then(function(curAction) {
      var actionArray = [];
      for(var i = 0, len = curAction.length; i < len; i++) {
        var action = [{action:curAction[i]}];
        knex(curAction[i].table_name).where({action_id: curAction[i].action_id}).then(function(curActionType) {
          var action_type = [{action_type:curActionType}];
          actionArray.push({action,action_type});
          //console.log('=====> action: ' + util.inspect(action[i]));
          //console.log('=====> action_type: ' + util.inspect(action_type));
          //console.log('=====> ActionArray1: ' + util.inspect(actionArray));
            console.log('======= ActionArray >> ' + util.inspect(actionArray));
            console.log('======= ActionArray ActionType[0] >> ' + util.inspect(actionArray[0].action));
            console.log('======= ActionArray Action[0] >> ' + util.inspect(actionArray[0].action_type));
        });
      }
    });
}

function createGroupAction() {

}

module.exports = {
  // User Functions
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUsersGroups,
  updateUser,
  comparePass,
  ensureAuthenticated,
  // Group Functions
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  joinGroup,
  getGroupMembers,
  // Group Action Functions
  getGroupActions,
  createGroupAction,
};
