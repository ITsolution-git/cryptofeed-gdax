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
/***************************************************************/
/**  User Functions **/
/***************************************************************/

// /**
// * @description Inserts user data into database
// * @param req: Request request object containing the user form data
// */
// // function createUser(req: Request) {
// //   const salt = bcrypt.genSaltSync();
// //   const hash = bcrypt.hashSync(req.body.password, salt);

// //   //TODO: Validate the email & username don't exist in the system
// //   const user = bookshelf.knex('user')
// //   .insert({
// //     email: req.body.email,
// //     username: req.body.username,
// //     password: hash,
// //     first_name: req.body.first_name,
// //     last_name: req.body.last_name,
// //     avatar_file: req.body.avatar_file,
// //     bio: req.body.bio,
// //     latitude: req.body.latitude,
// //     longitude: req.body.longitude
// //   })
// //   .returning('*');
// //   return user;
// // }

// /**
// * @description Validates the specified email is a valid format
// * @param email: String the email address for the account
// */
// function validateEmail(email: string) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
// }

// /**
// * @description Returns user data for the specified username
// * @param username: String the username for the account
// */
// function getUserByUsername(username: String) {
//   return bookshelf.knex('user').where({username}).first();
// }

// /**
// * @description Returns user data for the specified email
// * @param email: String the email address for the account
// */
// function getUserByEmail(email: String) {
//   return bookshelf.knex('user').where({email}).first();
// }

// /**
// * @description Returns user data for the specified id
// * @param user_id: Number id of the user
// */
// function getUserById(user_id: Number) {
//   return bookshelf.knex('user').where({user_id}).first();
// }

// /**
// * @description Returns user profile data for the specified id
// * @param user_id: Number id of the user
// */
// function getUserProfileById(user_id: Number) {
//   return bookshelf.knex('user').select('user_id', 'created_at', 'username', 'first_name', 'avatar_file', 'bio','latitude', 'longitude').where({user_id}).first();
// }

// /**
// * @description Updates the user record based on JSON array userBody
// * @param user_id: Number id of the user being updatedUser
// * @param user_body: JSON array of user fields to update
// */
// function updateUser(user_id: Number, user_body: JSON, callback) {
//   bookshelf.knex('user').where({user_id})
//     .update(user_body)
//     .then(function(count) {
//       callback(null, count);
//     });
// }

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
  getBaseUrl,
  // updateUser,
  ensureAuthenticated,
  
  createGroupAction,
  getActionById,
  createActionUser,
  getActionTypes,
  deleteAction,
  updateAction,
};
