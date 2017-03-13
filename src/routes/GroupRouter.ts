import {Router, Request, Response, NextFunction} from 'express';

let tokenHelper = require('../tools/tokens');
let toolHelpers = require('../tools/_helpers');
const groupHelper = require('../tools/group_helpers');
import {IRequest} from '../classes/IRequest';
const validate = require('../classes/ParamValidator');
import GroupValidation from '../validations/GroupValidation';
import Action from '../db/models/action';

var moment = require('moment');

var path = require('path'),
    fs = require('fs');

import Group from '../db/models/group';
var util = require('util');

export class GroupRouter {
  router: Router

  /**
   * Initialize the GroupRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * @description GET all public and non-deleted groups.
   * @param Request
   * @param Response
   * @param Callback (NextFunction)
   */
  public getPublicGroups(req: Request, res: Response, next: NextFunction) {

    Group.where({'private':0, 'deleted_at':null}).fetch({
      withRelated: [ 
        // {'settings':function(qb) {
        //   qb.select('allow_member_action','member_action_level', 'group_setting_id');
        // }}, 
        // {'tags':function(qb) {
        //   qb.select('group_tag_id', 'tag' );
        // }}, 
        'settings', 'tags',
        {'creator':function(qb) {
          qb.column('user_id', 'first_name', 'last_name', 'avatar_file');
        }}]
    })
    .asCallback((err, groups) => {
      if(err) {
          res.status(400).json({
          success: 0,
          message: err.message
        });
      } else {
        var tags = groups.related('tags').map(function(a) {
          return a.get('tag');
        });
        res.status(200).json({
          success: 1,
          groups: groups
        });
      }
    });
  }

  /**
   * @description GET group by id in request object
   * @param Request
   * @param Response
   * @param Callback function (NextFunction)
   * TODO: Need to make sure user is member of group, or group is public
   */
  //////////****getGroup will no longer need because the GET user/1/groups returns them */
  // public getGroup(req: Request, res: Response, next: NextFunction) {
  //   let groupId = parseInt(req.params.id);
  //   return toolHelpers.getGroupById(groupId)
  //   .asCallback((err, values) => {
  //     if(err) {
  //       res.status(404)
  //         .send({
  //           message: 'No group found with the given id.',
  //           status: res.status
  //         });
  //     } else {
  //       res.status(200)
  //         .send({
  //           message: 'Success',
  //           status: res.status,
  //           group: values
  //         });
  //     }
  //   });
  // }

    /**
    * @description Creates a new group
    * @param Request
    * @param Response
    * @param Callback Function
    */
  public createGroup(req: IRequest, res: Response, next: NextFunction) {
    return new Group(req.body).save()
      .then((group) => {
        if(req.files){
          try{
            let file = req.files.banner_image_file;
            let relativepath = './public/uploads/groups/banners/'+group.get('group_id')+path.extname(file.name).toLowerCase();
            var targetPath = path.resolve(relativepath);
            if ((path.extname(file.name).toLowerCase() === '.jpg')||
                (path.extname(file.name).toLowerCase() === '.png')) { 

              file.mv(targetPath, function(err) {
                if (err) {
                  err.message = "Upload failed";
                  throw err;
                }
                else {
                  return true;
                }
              });
              let image_url = toolHelpers.getBaseUrl(req) + 'uploads/groups/banners/'+group.get('group_id')+path.extname(file.name).toLowerCase();
              return group.save({banner_image_file:image_url });

            } else {
              let err = new Error();
              err.message = "Only jpg/png are acceptable";
              throw err;
            }
          }catch(err){
            if(!err.message) err.message = "Unknown error prevented from uploading";
            throw err;
          }
        }
        else{
          return group;
          
        }
      })
      .then((group) => {
        res.status(200).json({
            success: 1,
            token: tokenHelper.encodeToken(req.user.get('user_id')),
            user: req.user,
            group: group,
            message:"Success"
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: 0,
          message:err.message,
          data:err.data,  
        });
      });
  }


  /**
  * @description Create GET /groups/:group_id/actions API Call
                  Returns array of all non-deleted actions for the specified group
                  Only return all open actions, and any actions that ended in the last 2 months
                  Exclude any deleted actions (where action.deleted_at is not null)
                  
                  If group is private, only return actions if calling user is a member of the group
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Need to ensure user is member of group, or group is public
  */
  public getGroupActions(req: IRequest, res: Response, next: NextFunction) {
    res.status(200).json({
      success: 1,
      actions: req.current_group.related('open_actions')
    });
  }

  /**
  * @description  createGroupAction
          Create POST /groups/:group_id/actions API Call
              Creates a new action for the specified group
                  -Ensure required fields are sent: title, subtitle, description, thanks_msg, action_type_id
                  -Ensure submitter is a member of the group (group_user record) and:
                    ;Has group_user.submit_action = true
                    ;OR, group_setting.allow_member_action = true 
                       and user has earned points on group actions equal to 
                       or greater than group_setting.member_action_level


          “points” (int): Number of points
              If not specified, set to action_type.default_points
          “start_at” (datetime): Datetime action starts (default now)
          “end_at” (datetime): Datetime action ends (default 1 week)


          Returns the created action
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Need to ensure user is member of group, or group is public
  */
  public createGroupAction(req: IRequest, res: Response, next: NextFunction) {
    if((req.body.start_at && req.body.end_at && req.body.start_at > req.body.end_at) 
    ||(!req.body.start_at && req.body.end_at && moment() > moment(req.body.end_at)))
    {
      res.status(400).json({
        success: 0,
        message: "EndDate cannot be earlier than StartDate"
      })
    }
    req.body.start_at = req.body.start_at ? req.body.start_at : moment().format("YYYY-MM-DD HH:MM:SS");
    req.body.end_at = req.body.end_at ? req.body.end_at : moment(req.body.start_at).add(7, 'days').format("YYYY-MM-DD HH:MM:SS");
    req.body.points = req.body.points ? req.body.points : req.action_type.get('default_points');
    req.body.created_by_user_id = req.user.get('user_id');
    req.body.group_id = req.params.group_id;
    new Action(req.body).save()
    .then(action=>{
      return action.load(['creator', 'action_type']);
    })
    .then(action=>{
      res.status(200).json({
        success: 1,
        action: action
      })
    })
    .catch(err=>{
      res.status(400).json({
        success: 0,
        message: err.message
      })
    })
  }


  /**
  * @description updates details of a group
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: need to remove any data that shouldn't be updateable
  * TODO: need to ensure user has proper permissions to udpate group
  */
  public putGroup(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, user_id, token) => {
      if(err) {
          res.status(401).json({
          status: 'Token has expired',
          message: 'Your token has expired.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        toolHelpers.updateGroup(group_id, req.body, function(err, count) {
          toolHelpers.getGroupById(group_id)
            .then((group) => {
              res.status(200).json({
                status: 'success',
                token: tokenHelper.encodeToken(user_id),
                group: group
              });
          });
        });
      }
    });
  }

  /**
  * @description Allows user to join a group
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: need to ensure group is public, or member has group add code
  */
  public joinGroup(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, user_id, token) => {
      if(err) {
          res.status(401).json({
          status: 'Token has expired',
          message: 'Your token has expired.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        // TODO: ensure user is not a current member of the group
        toolHelpers.joinGroup(group_id, user_id, function() {
          toolHelpers.getGroupById(group_id)
            .then((group) => {
              res.status(200).json({
                status: 'success',
                token: tokenHelper.encodeToken(user_id),
                group: group
              });
          });
        });
      }
    });
  }

  /**
  * @description Allows user to join a group
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Need to ensure user is member of group, or group is public
  */
  public getGroupMembers(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, user_id, token) => {
      if(err) {
          res.status(401).json({
            status: 'Token has expired',
            message: 'Your token has expired.'
          });
      } else {
        let group_id = parseInt(req.params.id);
        var members = toolHelpers.getGroupMembers(group_id, function(err, members) {
          if(err) {
            res.status(400).json({
              status: 'error',
              message: 'Something went wrong.'
            });
          } else {
            res.status(200).json({
              status: 'success',
              token: tokenHelper.encodeToken(user_id),
              members: members
            });
          }
        });
      }
    });
  }


  /**
  * @description Gets a specific group action (by ID)
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Need to ensure user is member of group, or group is public
  */
  public getGroupAction(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        let action_id = parseInt(req.params.action_id);
        toolHelpers.getActionById(action_id, group_id)
        .then((action) => {
          res.status(200).json({
            status: 'success',
            token: tokenHelper.encodeToken(cur_user_id),
            action: action
          });
        })
        .catch((err) => {
          console.log(util.inspect(err));
          res.status(401).json({
            status: 'error',
            message: 'Something went wrong, and we didn\'t retreive the action. :('
          });
        });
      }
    });
  }

  /**
  * @description adds record to mark an action as complete
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Make sure user is member of the group
  */
  public markGroupActionComplete(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        let action_id = parseInt(req.params.action_id);
        toolHelpers.createActionUser(action_id, cur_user_id)
        .then((action) => {
          res.status(200).json({
            status: 'success',
            token: tokenHelper.encodeToken(cur_user_id)
          });
        })
        .catch((err) => {
          console.log(util.inspect(err));
          res.status(401).json({
            status: 'error',
            message: 'Something went wrong, and we didn\'t retreive the action. :('
          });
        });
      }
    });
  }

  /**
  * @description returns an array of supported action types
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  public getActionTypes(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        toolHelpers.getActionTypes()
        .then((action_types) => {
          res.status(200).json({
            status: 'success',
            token: tokenHelper.encodeToken(cur_user_id),
            action_types: action_types
          });
        })
        .catch((err) => {
          console.log(util.inspect(err));
          res.status(401).json({
            status: 'error',
            message: 'Something went wrong, and we didn\'t retreive the action types. :('
          });
        });
      }
    });
  }

  /**
  * @description sets the deleted_at flag for the specified group
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Make sure user has rights to delete the action (owner, admin)
  */
  public deleteGroupAction(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        let action_id = parseInt(req.params.action_id);
        toolHelpers.getActionById(action_id, group_id).then((action) => {
          toolHelpers.deleteAction(action_id, cur_user_id)
          .then((result) => {
            res.status(200).json({
              status: 'success',
              token: tokenHelper.encodeToken(cur_user_id),
              REMOVED: action
            });
          })
          .catch((err) => {
            console.log(util.inspect(err));
            res.status(401).json({
              status: 'error',
              message: 'Something went wrong, and we didn\'t retreive the action types. :('
            });
          });
        });
      }
    });
  }

  /**
  * @description updates the details of an action
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Make sure user has rights to update the action (owner, admin)
  * TODO: Make sure only updateable fields are on res.body
  */
  public updateGroupAction(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        let action_id = parseInt(req.params.action_id);
        toolHelpers.updateAction(action_id, req.body)
        .then((count) => {
          toolHelpers.getActionById(action_id, group_id)
          .then((action) => {
            res.status(200).json({
              status: 'success',
              token: tokenHelper.encodeToken(cur_user_id),
              action: action
            });
          });
        })
        .catch((err) => {
          console.log(util.inspect(err));
          res.status(401).json({
            status: 'error',
            message: 'Something went wrong, and we didn\'t retreive the action. :('
          });
        });
      }
    });
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getPublicGroups);
    this.router.post('/', toolHelpers.ensureAuthenticated, this.createGroup);
    // this.router.get('/:id', this.getGroup);
      // this.router.put('/:id', this.putGroup);
      // this.router.get('/:id/members', this.getGroupMembers);
      // this.router.post('/:id/members', this.joinGroup);
      // this.router.put('/:id/members/:user_id', this.updateGroupMember);
      // this.router.get('/:id/actions/types', this.getActionTypes);
    this.router.get('/:group_id/actions', 
                    toolHelpers.ensureAuthenticated,
                    validate(GroupValidation.getGroupActions),
                    groupHelper.checkGroup,
                    groupHelper.checkUserPermissionAccessGroup,
                    this.getGroupActions);
    this.router.post('/:group_id/actions', 
                    toolHelpers.ensureAuthenticated,
                    validate(GroupValidation.createGroupAction),
                    groupHelper.checkGroup,
                    groupHelper.checkActionType,
                    groupHelper.checkUserBelongsToGroup,
                    groupHelper.checkUserPermissionModifyGroupActions,
                    this.createGroupAction);
      // this.router.get('/:id/actions/:action_id', this.getGroupAction);
      // this.router.put('/:id/actions/:action_id', this.updateGroupAction);
      // this.router.delete('/:id/actions/:action_id', this.deleteGroupAction);
      // this.router.post('/:id/actions/:action_id/complete', this.markGroupActionComplete);
  }
}



// Create the GroupRouter, and export its configured Express.Router
const groupRoutes = new GroupRouter();
groupRoutes.init();

export default groupRoutes.router;
