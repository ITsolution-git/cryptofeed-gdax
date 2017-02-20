import {Router, Request, Response, NextFunction} from 'express';

let tokenHelper = require('../tools/tokens');
let toolHelpers = require('../tools/_helpers');


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
    toolHelpers.getAllGroups()
    .asCallback((err, values) => {
      if(err) {
          res.status(404).json({
          status: 'Error retrieving groups',
          message: 'Error retrieving groups.'
        });
      } else {
        res.status(200).json({
          status: 'success',
          groups: values
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
  public getGroup(req: Request, res: Response, next: NextFunction) {
    let groupId = parseInt(req.params.id);
    return toolHelpers.getGroupById(groupId)
    .asCallback((err, values) => {
      if(err) {
        res.status(404)
          .send({
            message: 'No group found with the given id.',
            status: res.status
          });
      } else {
        res.status(200)
          .send({
            message: 'Success',
            status: res.status,
            group: values
          });
      }
    });
  }

  /**
  * @description Creates a new group
  * @param Request
  * @param Response
  * @param Callback Function
  */
  public createGroup(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      return toolHelpers.createGroup(cur_user_id, req)
      .then((groupId) => {
        toolHelpers.getGroupById(groupId[0])
          .then((group) => {
            res.status(200).json({
              status: 'success',
              token: tokenHelper.encodeToken(cur_user_id),
              group: group
            });
        });
      })
      .catch((err) => {
        res.status(401).json({
          status: 'error',
          message: 'Something went wrong, and we didn\'t create a group. :('
        });
      });

    });
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
  * @description returns array of non-deleted actions for the group
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Need to ensure user is member of group, or group is public
  */
  public getGroupActions(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        toolHelpers.getGroupActions(group_id, function(err, actions) {
          if(err) {
            res.status(404).json({
              status: 'Error retrieving groups',
              message: 'Error retrieving groups.'
            });
          } else {
            res.status(200).json({
              status: 'success',
              actions: actions
            });
          }
        });
      }
    });
  }

  /**
  * @description creates a group action
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  * TODO: Need to ensure user has permission to add action
  */
  public createGroupAction(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        toolHelpers.createGroupAction(cur_user_id, req)
        .then((actionId) => {
          toolHelpers.getActionById(actionId[0], group_id)
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
            message: 'Something went wrong, and we didn\'t create an action. :('
          });
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
  * @description updates the group settings for a specific user. Current User
  * must have admin_members set as 1 (true) to do this
  * @param Request
  * @param Response
  * @param Callback function (NextFunction)
  */
  public updateGroupMember(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, cur_user_id) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        toolHelpers.getGroupMemberById(group_id, cur_user_id)
        .then((cur_user) => {
          if(cur_user.admin_members) {
            let user_id = parseInt(req.params.user_id);
            toolHelpers.updateGroupUser(group_id, user_id, req.body)
            .then((cnt) => {
              toolHelpers.getGroupMembers(group_id, function(err, members) {
                if(err) {
                  res.status(400).json({
                    status: 'error',
                    message: 'Something went wrong.'
                  });
                } else {
                  res.status(200).json({
                    status: 'success',
                    token: tokenHelper.encodeToken(cur_user_id),
                    members: members
                  });
                }

              });
            });
          } else {
            res.status(401).json({
              status: 'error',
              message: 'Not authorized'
            });
          }
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
    this.router.post('/', this.createGroup);
    this.router.get('/:id', this.getGroup);
    this.router.put('/:id', this.putGroup);
    this.router.get('/:id/members', this.getGroupMembers);
    this.router.post('/:id/members', this.joinGroup);
    this.router.put('/:id/members/:user_id', this.updateGroupMember);
    this.router.get('/:id/actions/types', this.getActionTypes);
    this.router.get('/:id/actions', this.getGroupActions);
    this.router.post('/:id/actions', this.createGroupAction);
    this.router.get('/:id/actions/:action_id', this.getGroupAction);
    this.router.put('/:id/actions/:action_id', this.updateGroupAction);
    this.router.delete('/:id/actions/:action_id', this.deleteGroupAction);
    this.router.post('/:id/actions/:action_id/complete', this.markGroupActionComplete);
  }
}



// Create the GroupRouter, and export its configured Express.Router
const groupRoutes = new GroupRouter();
groupRoutes.init();

export default groupRoutes.router;
