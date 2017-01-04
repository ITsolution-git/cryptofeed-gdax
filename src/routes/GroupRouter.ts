import {Router, Request, Response, NextFunction} from 'express';

const tokenHelper = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');


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
    tokenHelper.getUserIdFromRequest(req, (err, userId) => {
      return toolHelpers.createGroup(userId, req)
      .then((groupId) => {
        toolHelpers.getGroupById(groupId[0])
          .then((group) => {
            res.status(200).json({
              status: 'success',
              token: tokenHelper.encodeToken(userId),
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
        // TODO: need to remove any data that shouldn't be updateable
        // TODO: need to ensure user has proper permissions to udpate group
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
  */
  public getGroupActions(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, userId) => {
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

  public createGroupAction(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, userId) => {
      if(err) {
        res.status(400).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      } else {
        let group_id = parseInt(req.params.id);
        toolHelpers.createGroupAction(userId, req)
        .then((actionId) => {
          toolHelpers.getActionById(actionId[0], group_id)
            .then((action) => {
              res.status(200).json({
                status: 'success',
                token: tokenHelper.encodeToken(userId),
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

  public getGroupAction(req: Request, res: Response, next: NextFunction) {
    tokenHelper.getUserIdFromRequest(req, (err, userId) => {
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
            token: tokenHelper.encodeToken(userId),
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
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getPublicGroups);
    this.router.post('/', this.createGroup);
    this.router.get('/:id', this.getGroup);
    this.router.put('/:id', this.putGroup);
    this.router.post('/:id/members', this.joinGroup);
    this.router.get('/:id/members', this.getGroupMembers);
    this.router.get('/:id/actions', this.getGroupActions);
    this.router.post('/:id/actions', this.createGroupAction);
    this.router.get('/:id/actions/:action_id', this.getGroupAction);
  }
}



// Create the GroupRouter, and export its configured Express.Router
const groupRoutes = new GroupRouter();
groupRoutes.init();

export default groupRoutes.router;
