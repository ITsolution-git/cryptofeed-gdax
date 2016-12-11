import {Router, Request, Response, NextFunction} from 'express';
// Need to replace with database
const Groups = "{}"; //require('../data.json');

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
   * GET all Groups.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    res.send(Groups);
  }

  /**
   * GET one group by id
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    let query = parseInt(req.params.id);
    let group = "{}"; //Groups.find(group => group.id === query);
    if (group) {
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          group
        });
    }
    else {
      res.status(404)
        .send({
          message: 'No group found with the given id.',
          status: res.status
        });
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
  }

}



// Create the GroupRouter, and export its configured Express.Router
const groupRoutes = new GroupRouter();
groupRoutes.init();

export default groupRoutes.router;
