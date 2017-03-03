import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
import bookshelf from '../db/bookshelf';
var util = require('util');
import User from '../db/models/user';
import Group from '../db/models/group';

/* Check  
    - Group exists?
    - Group deleted?
  */
function checkGroup(req: IRequest, res: Response, next: NextFunction) {
  return Group.getGroupWithRelated(req.params.group_id, [
    'open_actions.creator', 'open_actions.action_type'])
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
module.exports = {
  checkGroup,
  checkUserPermissionAccessGroup,
};
