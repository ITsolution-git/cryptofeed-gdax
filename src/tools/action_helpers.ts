import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
import bookshelf from '../db/bookshelf';
var util = require('util');
import User from '../db/models/user';
import Action from '../db/models/action';

/* Check  
    - Action exists?
    - Action deleted?
  */
function checkAction(req: IRequest, res: Response, next: NextFunction) {
  return Action.getAction(req.params.action_id)
  .then(action=>{
    if(action==null)
      res.status(404).json({
        success: 0,
        message: "Action not found"
      });
    else if(action.get('deleted_at') != null)
      res.status(404).json({
        success: 0,
        message: "The action was deleted"
      });
    else{
      req.current_action = action;
      return next();
    }
  }).catch(err=>next(err));
}

/*
  must ensure req.action exist.
  Check  
    - Action belongs to current user with his groups?
  */
function checkUserBelongtoAction(req: IRequest, res: Response, next: NextFunction) {
  req.user.getGroupIDs()
  .then(groupIDs=>{
    if(groupIDs.indexOf(req.current_action.get('group_id')) == -1)
      res.status(403).json({
        success: 0,
        message: "User is not a member of the group"
      });
    else
      next();
  }).catch(err=>next(err));
    
}

/*
  must ensure req.action exist.
  must ensure user belongs to group
  Check  
    - has group_user.mod_actions = true, OR
    - is the action.created_by_user_id creator of the action
  */
function checkUserPermissionModAction(req: IRequest, res: Response, next: NextFunction) {
  if(req.user.get('user_id') == req.current_action.get('created_by_user_id'))
    return next();
  
  req.user.getGroupUser(req.current_action.get('group_id'))
  .then(groupuser=>{
    if(groupuser.get('mod_actions') == false)
      res.status(403).json({
        success: 0,
        message: "User has no permission to delete or update action"
      });
    else
      next();
  }).catch(err=>{
    next(err)
  });
    
}
module.exports = {
  checkAction,
  checkUserBelongtoAction,
  checkUserPermissionModAction
};
