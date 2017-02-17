import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
const tokenHelper = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
var util = require('util');
import User from '../db/models/user';
var path = require('path'),
    fs = require('fs');

export class UserRouter {
  router: Router


  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * @description Gets a user object for logged in user
   * @param  req Request object
   * @param  res Response object
   * @param  next NextFunction that is called
   * @return 200 JSON of user object
   */
    public getUser(req: IRequest, res: Response, next: NextFunction) {
      if(req.params.id) {
        return User.where({user_id:parseInt(req.params.id)}).fetch()
        .asCallback((err, user) => {
          res.status(200).json({
            status: 'success',
            token: tokenHelper.encodeToken(user.get('user_id')),
            user: user
          });
        });
      } else {
        res.status(200).json({
          status: 'success',
          token: tokenHelper.encodeToken(req.user.id),
          user: req.user
        });
      }
    }

    /**
    * @description Updates/Saves the current user's information
    * @param Request
    * @param Response
    * @param Callback function (NextFunction)
    */  
    public putUser(req: IRequest, res: Response, next: NextFunction) {
      let message = "";
      if(req.files){
        try{
          let file = req.files.avatar_url;
          let targetPath = path.resolve('./public/uploads/'+req.user.get('username')+path.extname(file.name).toLowerCase());
          if ((path.extname(file.name).toLowerCase() === '.jpg')||
              (path.extname(file.name).toLowerCase() === '.png')) { 
              file.mv(targetPath, function(err) {
                if (err) {
                  throw err;
                }
                else {
                  message = "Successfully Uploaded";
                  User.forge({user_id:req.user.id}).save(
                    {avatar_url:targetPath});
                }
              });   
          } else {
            message = "Only jpg/png are acceptable";
          }
        }catch(err){
          message = err.message;
        }
      }
      return User.forge({user_id:req.user.id}).saveUser(req.body)
      .then((user) => {
        req.user = user;
        return tokenHelper.encodeToken(user.get('user_id')); 
      })
      .then((token) => {
        res.status(200).json({
          success: 1,
          token: token,
          user: req.user,
          message:["Successfully updated", message]
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: 0,
          message:["Unknown error", message],
          user:[]
        });
      });
    }

    /**
    * @description Gets list of groups user belongs to
    * @param Request
    * @param Response
    * @param Callback function (NextFunction)
    */
    public getGroups(req: IRequest, res: Response, next: NextFunction) {
      let uid = parseInt(req.params.id);

      if(!uid) {
        uid = req.user.id;
      }
      User.where({user_id: uid}).fetch({withRelated: ['groups']})
      .asCallback((err, user) => {
        if(err) res.status(200).json({status: 'error', err:err});
        res.status(200).json({
          status: 'success',
          token: tokenHelper.encodeToken(req.user.id),
          groups: user.related('groups')
        });
      });
    }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    // Routes for /api/v1/user
    this.router.get('/', this.getUser);
    this.router.put('/', this.putUser);
    this.router.get('/groups', this.getGroups);
    this.router.get('/:id', this.getUser);
    this.router.get('/:id/groups', this.getGroups);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new UserRouter();
authRoutes.init();

export default authRoutes.router;
