import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
const bookshelf = require('../db/connection');
const bcrypt = require('bcryptjs');
const tokenHelper = require('./tokens');
var util = require('util');
import User from '../db/models/user';

/***************************************************************/
/**  User Functions **/
/***************************************************************/

/**
* @description Inserts user data into database
* @param req: Request request object containing the user form data
*/
// function createUser(req: Request) {
//   const salt = bcrypt.genSaltSync();
//   const hash = bcrypt.hashSync(req.body.password, salt);

//   //TODO: Validate the email & username don't exist in the system
//   const user = bookshelf.knex('user')
//   .insert({
//     email: req.body.email,
//     username: req.body.username,
//     password: hash,
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     avatar_file: req.body.avatar_file,
//     bio: req.body.bio,
//     latitude: req.body.latitude,
//     longitude: req.body.longitude
//   })
//   .returning('*');
//   return user;
// }

/**
* @description Validates the specified email is a valid format
* @param email: String the email address for the account
*/
function validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
* @description Returns user data for the specified username
* @param username: String the username for the account
*/
function getUserByUsername(username: String) {
  return bookshelf.knex('user').where({username}).first();
}

/**
* @description Returns user data for the specified email
* @param email: String the email address for the account
*/
function getUserByEmail(email: String) {
  return bookshelf.knex('user').where({email}).first();
}

/**
* @description Returns user data for the specified id
* @param user_id: Number id of the user
*/
function getUserById(user_id: Number) {
  return bookshelf.knex('user').where({user_id}).first();
}

/**
* @description Returns user profile data for the specified id
* @param user_id: Number id of the user
*/
function getUserProfileById(user_id: Number) {
  return bookshelf.knex('user').select('user_id', 'created_at', 'username', 'first_name', 'avatar_file', 'bio','latitude', 'longitude').where({user_id}).first();
}

/**
* @description Updates the user record based on JSON array userBody
* @param user_id: Number id of the user being updatedUser
* @param user_body: JSON array of user fields to update
*/
function updateUser(user_id: Number, user_body: JSON, callback) {
  bookshelf.knex('user').where({user_id})
    .update(user_body)
    .then(function(count) {
      callback(null, count);
    });
}

/**
* @description Compares the given (plain text) password and encrypted password
* @param userPassword: String plain text password being tested
* @param databasePassword: String encrypted password to test against
*/
// function comparePass(userPassword: String, databasePassword: String) {
//   const bool = bcrypt.compareSync(userPassword, databasePassword);
//   if (!bool) throw new Error('invalid password');
//   else return true;
// }

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
        status: 'Authentication required',
        message: 'Your token has expired.'
      });
    } else {
      // check if the user still exists in the db
      return User.where({user_id: user_id}).fetch()
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(400).json({
          success: 0,
          message: err.message
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
* @param user_id: Number id of the user
*/
function getUsersGroups(user_id: Number) {
  //TODO: Need to return creator profile info with the group
  //TODO: Need to return group setting info with the group
  return bookshelf.knex('group')
    .innerJoin('group_user', 'group.group_id', 'group_user.group_id')
    .where('user_id', user_id);
}

/**
* @description Returns all the groups the user belongs to
* @param user_id: Number id of the user
*/
function getUsersPublicGroups(user_id: Number) {
  //TODO: Need to return creator profile info with the group
  //TODO: Need to return group setting info with the group
  return bookshelf.knex('group')
    .innerJoin('group_user', 'group.group_id', 'group_user.group_id')
    .where({'user_id':user_id, 'private':0});
}

/**
* @description Returns all non-private and non-deleted groups (public call)
*/
function getAllGroups() {
  return bookshelf.knex('group')
    .where({'private':0, 'deleted_at':null});
}

/**
* @description Returns a single group as specified by group_id
* @param group_id: Number ID of the group to return
*/
function getGroupById(group_id: Number) {
  return bookshelf.knex('group')
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
* @param owner_id: Number user_id of person creating group
* @param req: Request object
*/
function createGroup(owner_id: Number, req: Request) {
  let groupCode = createGroupCode();
  return bookshelf.knex('group')
  .insert({
    created_by_user_id: owner_id,
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
* @param group_id: Number ID of the group
* @param group_body: JSON array of group data being updated
* @param callback function
*/
function updateGroup(group_id: Number, group_body: JSON, callback) {
  bookshelf.knex('group').where({group_id})
    .update(group_body)
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
  bookshelf.knex('group_user')
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
* @description Returns array of group members (excludes banned)
* @param Number ID of the group
* @param callback function
*/
function getGroupMembers(group_id: Number, callback) {
  bookshelf.knex('user').select('user.user_id', 'user.username', 'user.avatar_file',
                      'group_user.admin_settings', 'group_user.admin_members',
                      'group_user.mod_actions', 'group_user.mod_comments',
                      'group_user.submit_action')
    .from('user')
    .innerJoin('group_user', 'user.user_id', 'group_user.user_id')
    .where({ group_id:group_id, banned:0 })
    .asCallback(function(err, values) {
      callback(err, values);
    });
}

/**
* @description Updates settings for a group user
* @param group_id: Number ID of the group
* @param user_id: Number ID of the user being edited
* @param perm_body: JSON array of settings being updated
*/
function updateGroupUser(group_id: Number, user_id: Number, perm_body: JSON) {
  return bookshelf.knex('group_user')
    .update(perm_body)
    .where({group_id, user_id})
    .returning('*');
}

/**
* @description gets specific group_user record for user
* @param group_id: Number ID of the group
* @param user_id: Number ID of the user
*/
function getGroupMemberById(group_id: Number, user_id: Number) {
  return bookshelf.knex('group_user')
    .where({group_id, user_id}).first();
}

/***************************************************************/
/**  Group Action Functions **/
/***************************************************************/

/**
* @description returns all non-deleted actions for specified group_id
* @param group_id int id of group
*/
function getGroupActions(group_id, callback) {
  bookshelf.knex('action')
    .innerJoin('action_type', 'action.action_type_id', 'action_type.action_type_id')
    .where({'action.group_id':group_id, 'action.deleted_at':null})
    .asCallback(function(err, actions) {
      callback(err, actions);
    });
}

/**
* @description creates a new group action
* @param owner_id: Number user_id of the person creating the action
* @param req: Request object containing action information
*/
function createGroupAction(owner_id: Number, req: Request) {
  let group_id = parseInt(req.params.id);
  return bookshelf.knex('action')
  .insert({
    group_id: group_id,
    created_by_user_id: owner_id,
    action_type_id: req.body.action_type_id,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    thanks_msg: req.body.thanks_msg,
    points: req.body.points,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
    param1: req.body.param1,
    param2: req.body.param2,
    param3: req.body.param3,
    param4: req.body.param4
  })
  .returning('action_id');
}

/**
* @description Returns a single action by its action_id
* @param action_id Number ID of the action to return
* @param group_id: Number ID of group action belongs to
*/
function getActionById(action_id: Number, group_id: Number) {
  return bookshelf.knex('action').where({action_id, group_id, deleted_at: null}).first();
}

/**
* @description Creates an action_user record to record a user completed an action
* @param action_id: Number ID of the action
* @param user_id: Number ID of the user performing the action
* TODO: Need to make sure user has not already completed action
*/
function createActionUser(action_id: Number, user_id: Number) {
  return bookshelf.knex('action').where({action_id, deleted_at: null})
    .then(function(action) {
      return bookshelf.knex('action_user')
      .insert({
        action_id: action_id,
        user_id: user_id,
        points: action[0].points
      })
      .returning('*');
    });
}

/**
* @description Returns all supported action types
*/
function getActionTypes() {
  return bookshelf.knex('action_type').select('*')
    .returning('*');
}

/**
* @description Marks the specified action deleted by setting the deleted_at flag
* @param action_id: Number ID of action to be marked deleted
* @param user_id: ID of the user marking the action as deleted
*/
function deleteAction(action_id: Number, user_id: Number) {
  return bookshelf.knex('action').where({action_id})
    .update({deleted_at: bookshelf.knex.fn.now(), deleted_by_user_id: user_id});
}

function updateAction(action_id: Number, action_body: JSON) {
  return bookshelf.knex('action').where({action_id})
    .update(action_body);
}

module.exports = {
  // User Functions
  validateEmail,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUserProfileById,
  getUsersGroups,
  getUsersPublicGroups,
  updateUser,
  ensureAuthenticated,
  // Group Functions
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  joinGroup,
  getGroupMembers,
  updateGroupUser,
  getGroupMemberById,
  // Group Action Functions
  getGroupActions,
  createGroupAction,
  getActionById,
  createActionUser,
  getActionTypes,
  deleteAction,
  updateAction,
};
