import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
const tokenHelper = require('../tools/tokens');
const actionHelper = require('../tools/action_helpers');
const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');
import ActionValidation from '../validations/ActionValidation';

import bluebird from 'bluebird';
var util = require('util');
import User from '../db/models/user';
import Group from '../db/models/group';
import ActionUser from '../db/models/action_user';
import GroupUser from '../db/models/group_user';
import Action from '../db/models/action';

var path = require('path'),
    fs = require('fs');

export class ActionRouter {
  router: Router


  /**
   * Initialize the ActionRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  
  /**
  * @description Gets list of actions user can perform
  *              skip = 0 and deleted_at=null
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  
  public getAction(req: IRequest, res: Response, next: NextFunction) {
    var userGroupsIDs = [];
    var retAction = {};
    return GroupUser.collection().query(function(qb) {
      qb.where('user_id', '=', req.user.get('user_id'))
    }).fetch({columns:['group_id']})
    .then(groups=>{
      userGroupsIDs = groups.toJSON().map((group)=>{return group.group_id});

      return Action.where({action_id:req.params.action_id}).fetch({withRelated:[
        {'creator':function(qb) {
          qb.column('user_id', 'first_name', 'last_name', 'avatar_file');
        }},
        'action_type']})
    })
    .then(action=>{
      if(action==null)
        res.status(404).json({
          success: 0,
          message: "Action not found"
        });
      else if(userGroupsIDs.indexOf(action.get('group_id')) == -1)
        res.status(403).json({
          success: 0,
          message: "User is not a member of the group"
        });
      else if(action.get('deleted_at') != null)
        res.status(404).json({
          success: 0,
          message: "The action was deleted"
        });
      else{
        retAction = action;
        return ActionUser.where({action_id:req.params.action_id, user_id:req.user.get('user_id')}).fetch();
      }
    })
    .then(actionuser=>{
      if((actionuser != null) && (actionuser.get('skip') == true))
        res.status(404).json({
          success: 0,
          message: "The action was skipped by user"
        });
      else
        res.status(404).json({
          success: 1,
          action: retAction
        });
    })
    .catch(err=>{
      res.status(400).json({
        success: 0,
        message: err.message,
      })
    })
  }


  /**
  * @description Create POST /actions/:action_id/skip API Call
                Creates new action_user record and sets action_user.points= 0, and action_user.skip = true
                If user has an existing completed or skipped action_user record for the specified action, return an error.
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  
  public skipAction(req: IRequest, res: Response, next: NextFunction) {
     return ActionUser.where({action_id:req.params.action_id, 
                              user_id:req.user.get('user_id')}).fetch()
     .then(action_user=>{
       if(action_user != null){
        return res.status(405).json({
          success: 0,
          message: "User already completed/skipped action and is not allowed to do it again"
        });
       }
       else{
         new ActionUser({user_id: req.user.get('user_id'),
                         action_id: req.current_action.get('action_id'),
                         skip:true,
                         points:0}).save()
        .then(function(actionuser) {
          res.status(200).json({
            success: 1,
            message: "The action was skipped"
          })
        })
       }
     }).catch(err=>{
       res.status(500).json({
          success: 1,
          message: "Unknown error"
        });
     })
  }


  /**
  * @description Create POST /actions/:action_id/complete API Call
                  Creates new action_user record and sets action_user.points equal to action.points, based on the action being marked complete.
                  If user has an existing completed action_user record for the specified action, return an error.
                  If user has an existing "skipped" action_user record for the specified action, set action_user.skipped to false, and update action_user.points accordingly
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  
  public completeAction(req: IRequest, res: Response, next: NextFunction) {
     return ActionUser.where({action_id:req.params.action_id, 
                              user_id:req.user.get('user_id')}).fetch()
     .then(action_user=>{
       if(action_user != null){
         if((action_user.get('skip') == false)){
          res.status(405).json({
            success: 1,
            message: "The action was already completed"
          })
         }
         else{
           action_user.save({skip:false, 
                             points: req.current_action.get('points')})
           .then(action_user=>{
             res.status(200).json({
               success: 1,
               message: "The action is completed"
             });
           })
         }
       }
       else{
         new ActionUser({user_id: req.user.get('user_id'),
                    action_id: req.current_action.get('action_id'),
                    skip:false,
                    points:req.current_action.get('points')}).save()
        .then(function(actionuser) {
          res.status(200).json({
            success: 1,
            message: "The action was completed"
          })
        })
       }
     }).catch(err=>{
       res.status(500).json({
          success: 1,
          message: err.message
        });
     })
  }

  /**
  * @description 
            - Create DELETE `/actions/:action_id` API Call
            - Ensure caller is member of the group and either:
              - has `group_user.mod_actions` = true, OR
              - is the `action.created_by_user_id` creator of the action
            - Delete action should *not* delete the action, but should set the `deleted_at` datetime, and set `deleted_by_user_id` to the user_id of the calling user

  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  
  public deleteAction(req: IRequest, res: Response, next: NextFunction) {
     return req.current_action.save({deleted_at: new Date(),
                                     deleted_by_user_id: req.user.get('user_id')})
     .then(action=>{
        res.status(200).json({
          success: 1,
          message: "The action is successfully deleted"
        })
     }).catch(err=>{
       res.status(500).json({
          success: 1,
          message: err.message
        });
     })
  }

  /**
  * @description 
            Create PUT /actions/:action_id API Call
            Updates the specified action based on the submitted payload
            Ensure caller is member of the group and either:
              has group_user.mod_actions = true, OR
              is the action.created_by_user_id creator of the action

  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  
  public putAction(req: IRequest, res: Response, next: NextFunction) {
     return req.current_action.save(req.body)
     .then(action=>{
        res.status(200).json({
          success: 1,
          message: "The action is successfully updated",
          action: action
        })
     }).catch(err=>{
       res.status(500).json({
          success: 1,
          message: err.message
        });
     })
  }
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {  
    // Routes for /api/v1/action
    // this.router.get('/', this.getUser);
    this.router.get('/:action_id', validate(ActionValidation.needActionId), this.getAction);  

    this.router.delete('/:action_id', 
                validate(ActionValidation.needActionId), 
                actionHelper.checkAction,
                actionHelper.checkUserBelongtoAction,
                actionHelper.checkUserPermissionModAction,
                this.deleteAction);
    this.router.put('/:action_id', 
                validate(ActionValidation.putAction),
                actionHelper.checkAction,
                actionHelper.checkUserBelongtoAction,
                actionHelper.checkUserPermissionModAction,
                this.putAction);

    this.router.get('/:action_id/skip', 
                validate(ActionValidation.needActionId), 
                actionHelper.checkAction,
                actionHelper.checkUserBelongtoAction,
                this.skipAction);
    this.router.get('/:action_id/complete', 
                validate(ActionValidation.needActionId), 
                actionHelper.checkAction,
                actionHelper.checkUserBelongtoAction,
                this.completeAction);
  }

}

// Create the ActionRouter, and export its configured Express.Router
const actionRoutes = new ActionRouter();
actionRoutes.init();

export default actionRoutes.router;
