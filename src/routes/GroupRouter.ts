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
   * GET all public and non-deleted groups.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    let groupData = toolHelpers.getAllGroups()
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
   * GET one group by id
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    let groupId = parseInt(req.params.id);
    return toolHelpers.getOneGroup(groupId)
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

  public createGroup(req: Request, res: Response, next: NextFunction) {
    console.log('CREATEGROUP');
    tokenHelper.getUserIdFromRequest(req, (err, userId) => {
      console.log('USER_ID: ' + userId);
      return toolHelpers.createGroup(userId, req)
      .then((group) => {
        console.log('RAN IT: ' + util.inspect(group));
        res.status(200).json({
          status: 'success',
          token: tokenHelper.encodeToken(userId),
          group: group
        });
      })
      .catch((err) => {
        console.log('ERROR');
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong, and we didn\'t create a user. :('
        });
      });

    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.createGroup);
    this.router.get('/:id', this.getOne);
  }

}



// Create the GroupRouter, and export its configured Express.Router
const groupRoutes = new GroupRouter();
groupRoutes.init();

export default groupRoutes.router;
