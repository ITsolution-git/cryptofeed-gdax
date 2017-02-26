import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
const tokenHelper = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');
import UserValidation from '../validations/UserValidation';

import bluebird from 'bluebird';
var util = require('util');
import User from '../db/models/user';
import Group from '../db/models/group';
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
          if(err)
            throw err;
          else if(user == null)
            res.status(400).json({
              success: 1,
              message: "No user id"
            })
          else 
            res.status(200).json({
              success: 1,
              user: user
            });
        })
        .catch(function(err){
          res.status(400).json({
            success: 0,
            message: err.message
          })
        });
      } else {
        res.status(200).json({
          success: 1,
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
      return req.user.save(req.body)
      .then((user) => {
        req.user = user;
        if(req.files){
          try{
            let file = req.files.avatar_file;
            var targetPath = path.resolve('./public/uploads/users/avatars/'+req.user.get('user_id')+path.extname(file.name).toLowerCase());
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
              return true;  
            } else {
              let err = new Error();
              err.message = "Only jpg/png are acceptable";
              throw err;
            }
          }catch(err){
            throw err;
          }
        }
        else{
          return false;
        }
      })
      .then((isUploadSuccess)=>{
        if(isUploadSuccess){
          let image_url = toolHelpers.getBaseUrl(req) + 'uploads/users/avatars/'+req.user.get('user_id')+path.extname(req.files.avatar_file.name).toLowerCase();
             
          return req.user.save({avatar_file:image_url});
        }
        else
          return req.user;
      })
      .then((user) => {
        req.user = user;
        return tokenHelper.encodeToken(user.get('user_id')); 
      })
      .then((token) => {
        res.status(200).json({
          success: 1,
          token: token,
          user: req.user,
          message:"Success"
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: 0,
          message:err.message,
          data:err.data,  
          user:{},
          token:""
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
      let uid;

      if(!req.params.id) {
        uid = req.user.id;
      }
      else
        uid = parseInt(req.params.id);
      User.where({user_id: uid}).fetch({
        withRelated: [ 'groups', 'groups.settings', 'groups.tags', 'groups.creator']
      })
      .asCallback((err, user) => {
        if(err) return res.status(500).json({success: 0, message:err.message, token:"", groups:[]});
        if(user == null) return res.status(500).json({success:0, message:"Invalid userid"});
          return res.status(200).json({
            success: 1,
            groups: user.related('groups')
          });
      });
    }
    public putUserpassword(req: IRequest, res: Response, next: NextFunction) {
      try{
        req.user.authenticate(req.body.original_password);
        
        req.user.save({ 
          password:req.body.new_password })
        .then((user) => {
          req.user = user;
          return tokenHelper.encodeToken(user.get('user_id')); 
        })
        .then((token) => {
          res.status(200).json({
            success: 1,
            token: token,
            user: req.user,
            message:"Success"
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: 0,
            message:err.message,
            data:err.data,
          });
        });
      }catch(err){
        res.status(400).json({
          success: 0,
          message: err.message,
          data: []
        })
      }
    }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    // Routes for /api/v1/user
    this.router.get('/', this.getUser);
    this.router.put('/', validate(UserValidation.putUser), this.putUser);
    this.router.put('/password', validate(UserValidation.putUserpassword), this.putUserpassword);
    this.router.get('/groups',  this.getGroups);
    this.router.get('/:id', validate(UserValidation.getUser), this.getUser);
    this.router.get('/:id/groups', validate(UserValidation.getUserGroups), this.getGroups);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new UserRouter();
authRoutes.init();

export default authRoutes.router;
