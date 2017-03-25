//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//DB Import
import bookshelf from '../db/bookshelf';
//NPM Import
var util = require('util');
//Models Import
import User from '../db/models/user';
import Group from '../db/models/group';
import ActionType from '../db/models/action_type';
//Helpers Import
let toolHelpers = require('../tools/_helpers');
let tokenHelper = require('../tools/tokens');

/* Check  
    - Group exists?
    - Group deleted?
  */
function checkGroup(req: IRequest, res: Response, next: NextFunction) {
  return Group.getGroupWithRelated(req.params.group_id, [
    'open_actions.creator', 'open_actions.action_type',
    'users', 'tags', 'setting', 'creator'])
  .then(group=>{
    if(group==null)
      res.status(404).json({
        success: 0,
        message: "Group not found"
      });
    else if(group.get('deleted_at') != null)
      res.status(404).json({
        success: 0,
        message: "The group was deleted"
      });
    else{
      req.current_group = group;
      return next();
    }
  }).catch(err=>next(err));
}


/*
  must ensure req.group exist.
  Check  
     If group is private, only return actions if calling user is a member of the group   
  */
function checkUserPermissionAccessGroup(req: IRequest, res: Response, next: NextFunction) {
  if(req.current_group.get('private') == 1){ //if private
    req.user.getGroupIDs().then(function(groupIDs){
      if(groupIDs.indexOf(req.current_group.get('group_id')) == -1){
        //If user is not a member of group
        return res.status(403).json({
          success: 0,
          message: "You are not allowed to access private group"
        }); 
      }
      else{
        return next();
      }
    });
  }
  //Otherwise  -groups is public or user belongs to private group
  else{
    return next();
  }
}


/*
  must ensure req.body.action_type_id exist.
  Check  
    return req.action_type
  */
function checkActionType(req: IRequest, res: Response, next: NextFunction) {
  ActionType.where({action_type_id: req.body.action_type_id}).fetch()
  .then(action_type=>{
    if(action_type == null){
      res.status(404).json({
        success: 0,
        message: "No Action Type exist"
      })
    }
    else{
      req.action_type = action_type;
      next();
    }
  })
  .catch(err=>{
    next(err)
  });
}


/*
  must ensure req.group exist.
  Check  
     if the user is member of this group
  */
function checkUserBelongsToGroup(req: IRequest, res: Response, next: NextFunction) {
  req.user.getGroupIDs().then(function(groupIDs){
    if(groupIDs.indexOf(req.current_group.get('group_id')) == -1){
      //If user is not a member of group
      return res.status(403).json({
        success: 0,
        message: "User is not member of the group"
      }); 
    }
    else{
      return next();
    }
  });
}

/*
  GET 
   *                - all public and non-deleted groups.
   *                - Exclude group ID 1 from data set (always)
  */
function publicGroups(req: IRequest, res: Response, next: NextFunction) {
  tokenHelper.getUserIdFromRequest(req)
  .then(({err, user_id}) => {
    if(!err) {
      return User.where({user_id: user_id}).fetch()
      .then((user) => {
        if(user != null){
          return user.getGroupIDs();  //Returns user groupsID if authenicated
        }else{
          return new Promise((resolve, reject)=>{
            resolve([]);    //Retuns empty if error
          })
        }

      })
      .catch(err => {
        res.json({  
          success: 0,
          message: err.message
        });
      });
    }
    else{
      // On error cases, just return public/non-deleted/filtered groups
      return new Promise((resolve, reject)=>{
        resolve([]);    //Retuns empty if error
      })
    }
  })
  .then(userGroupIDs=>{
    Group.collection().query(function(qb){
      qb.where(function(){
        this.where('private', '=', 0);
        this.whereNull('deleted_at');
        this.whereNot('group_id', 1);
      }).orWhereIn('group.group_id', userGroupIDs);
    }).fetch({
      withRelated: [ 
        {'tags':function(qb) {
          qb.select('group_tag_id', 'tag', 'group_id');
        }},
        'setting',
        {'creator':function(qb) {
          qb.column('user_id', 'first_name', 'last_name', 'avatar_file');
        }}]
    })
    .asCallback((err, groups) => {
      if(err) {
        throw err;
      } else {
        req.publicGroups = groups;
        next();
      }
    });
  })
}

/*
  must ensure req.group exist.
  Check  
      -Has group_user.submit_action = true
      -OR, group_setting.allow_member_action = true and user has earned points on group actions equal to or greater than group_setting.member_action_level  
  */
function checkUserPermissionModifyGroupActions(req: IRequest, res: Response, next: NextFunction) {
  req.user.getGroupUser(req.current_group.get('group_id'))
  .then(groupuser=>{
    if(groupuser.get('submit_action') == true) //if user's permission on group has submit action
      return next();
    else{
      let setting = req.current_group.related('setting');
      if(setting && setting.get('allow_member_action') == true){
        req.user.getTotalPointsOn(req.current_group)
        .then(point=>{
          if(point >= req.current_group.related('setting').get('member_action_level'))
            return next();
          else
            res.status(403).json({
              success: 0,
              message: "You are not allowed to create action to this group"
            })
        })
      }
      else{
        res.status(403).json({
          success: 0,
          message: "You are not allowed to create action to this group"
        })
      }
    }
  })
  .catch(err=>{
    next(err)
  });
}

module.exports = {
  checkGroup,
  checkUserPermissionAccessGroup,
  checkUserBelongsToGroup,
  checkActionType,
  checkUserPermissionModifyGroupActions,
  publicGroups
};
