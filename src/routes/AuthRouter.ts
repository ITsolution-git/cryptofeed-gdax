import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
const validate = require('../classes/ParamValidator');
import AuthValidation from '../validations/AuthValidation';

var request = require('request');

const tokenHelpers = require('../tools/tokens');
const toolHelpers = require('../tools/_helpers');
var util = require('util');
import User from '../db/models/user';

export class AuthRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

/**
 * Creates new user record in database
 * @param  req Request object
 * @param  res Response object
 * @param  next NextFunction that is called
 * @return 200 JSON of user object
 * TODO: throw error if email or username already exists : Done
 */
  public register(req: IRequest, res: Response, next: NextFunction) {
    return new User(req.body).save()
    .then((user) => {
      req.user = user;
      return user.addDefaultGroup();
    })
    .then(groupuser=>{
      return tokenHelpers.encodeToken(req.user.get('user_id'));
    })
    .then((token) => {
      let filterPassword = req.user.toJSON();
      delete filterPassword['password'];
      res.status(200).json({
        success: 1,
        user: filterPassword,
        token: token
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: 0,
        message: err.message,
        data: err.data,
        user: {},
        token: "",
      });
    });
  }

 /**
  * Logs the user in. Expects email and password in request object.
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public login(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    return User.where({email : email}).fetch()
    .then((user) => {
      if(!user)
        throw Error("Invalid email address");
      user.authenticate(password);
      req.user = user.toJSON();
      delete req.user['password'];
      return user;
    })
    .then((response) => {
      return tokenHelpers.encodeToken(response.id);
    })
    .then((token) => {
      res.status(200).json({
        success: 1,
        token: token,
        user: req.user
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: 0,
        user: {},
        token: "",
        data: err.data,
        message: err.message
      });
    });
  }

 /**
  * Logs the user in with facebook. Expects email and facebook in request object.
      Register new User
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public facebookRegister(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    return User.where({email : email}).fetch()
    .then((user) => {
      if(!user){
        return new User(req.body).save()
        .then((user) => {
          req.user = user;
          return user.addDefaultGroup();
        })
        .then(groupuser=>{
          return tokenHelpers.encodeToken(req.user.get('user_id'));
        })
      }
      else{
        throw new Error( "You have already registed. Please log in.");
      }
    })
    .then((token) => {
      let filterPassword = req.user.toJSON();
      delete filterPassword['password'];
      res.status(200).json({
        success: 1,
        user: filterPassword,
        token: token
      });
    })
    .catch((err) => {
      return res.status(401).json({
        success: 0,
        message: err.message,
        data: err.data
      });
    });
  //   var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  //   var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  //   var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  //   var params = {
  //     code: req.body.code,
  //     client_id: req.body.clientId,
  //     client_secret: config.FACEBOOK_SECRET,
  //     redirect_uri: req.body.redirectUri
  //   };

  //   // Step 1. Exchange authorization code for access token.
  //   request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
  //     if (response.statusCode !== 200) {
  //       return res.status(500).send({ message: accessToken.error.message });
  //     }

  //     // Step 2. Retrieve profile information about the current user.
  //     request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
  //       if (response.statusCode !== 200) {
  //         return res.status(500).send({ message: profile.error.message });
  //       }
  //       if (req.header('Authorization')) {
  //         User.findOne({ facebook: profile.id }, function(err, existingUser) {
  //           if (existingUser) {
  //             return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
  //           }
  //           var token = req.header('Authorization').split(' ')[1];
  //           var payload = jwt.decode(token, config.TOKEN_SECRET);
  //           User.findById(payload.sub, function(err, user) {
  //             if (!user) {
  //               return res.status(400).send({ message: 'User not found' });
  //             }
  //             user.facebook = profile.id;
  //             user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
  //             user.displayName = user.displayName || profile.name;
  //             user.save(function() {
  //               var token = createJWT(user);
  //               res.send({ token: token });
  //             });
  //           });
  //         });
  //       } else {
  //         // Step 3. Create a new user account or return an existing one.
  //         User.findOne({ facebook: profile.id }, function(err, existingUser) {
  //           if (existingUser) {
  //             var token = createJWT(existingUser);
  //             return res.send({ token: token });
  //           }
  //           var user = new User();
  //           user.facebook = profile.id;
  //           user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
  //           user.displayName = profile.name;
  //           user.save(function() {
  //             var token = createJWT(user);
  //             res.send({ token: token });
  //           });
  //         });
  //       }
  //     });
  //   });
  // });

  }


 /**
  * Logs the user in with facebook. Expects email and facebook in request object.
      Register new User
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public facebookLogin(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    return User.where({email : email}).fetch()
    .then((user) => {
      if(!user){
        throw new Error( "You are not registed. Please signup first");
      }
      else{
        req.user = user;
        return tokenHelpers.encodeToken(req.user.get('user_id'));
      }
    })
    .then((token) => {
      let filterPassword = req.user.toJSON();
      delete filterPassword['password'];
      res.status(200).json({
        success: 1,
        user: filterPassword,
        token: token
      });
    })
    .catch((err) => {
      return res.status(401).json({
        success: 0,
        message: err.message,
        data: err.data
      });
    });
  }
 
 /**
  * Logs the user in with facebook. Expects email and facebook in request object.
      Register new User
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public twitterRegister(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    return User.where({email : email}).fetch()
    .then((user) => {
      if(!user){
        return new User(req.body).save()
        .then((user) => {
          req.user = user;
          return user.addDefaultGroup();
        })
        .then(groupuser=>{
          return tokenHelpers.encodeToken(req.user.get('user_id'));
        })
      }
      else{
        throw new Error( "You have already registed. Please log in.");
      }
    })
    .then((token) => {
      let filterPassword = req.user.toJSON();
      delete filterPassword['password'];
      res.status(200).json({
        success: 1,
        user: filterPassword,
        token: token
      });
    })
    .catch((err) => {
      return res.status(401).json({
        success: 0,
        message: err.message,
        data: err.data
      });
    });
  //   var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  //   var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  //   var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  //   var params = {
  //     code: req.body.code,
  //     client_id: req.body.clientId,
  //     client_secret: config.FACEBOOK_SECRET,
  //     redirect_uri: req.body.redirectUri
  //   };

  //   // Step 1. Exchange authorization code for access token.
  //   request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
  //     if (response.statusCode !== 200) {
  //       return res.status(500).send({ message: accessToken.error.message });
  //     }

  //     // Step 2. Retrieve profile information about the current user.
  //     request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
  //       if (response.statusCode !== 200) {
  //         return res.status(500).send({ message: profile.error.message });
  //       }
  //       if (req.header('Authorization')) {
  //         User.findOne({ facebook: profile.id }, function(err, existingUser) {
  //           if (existingUser) {
  //             return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
  //           }
  //           var token = req.header('Authorization').split(' ')[1];
  //           var payload = jwt.decode(token, config.TOKEN_SECRET);
  //           User.findById(payload.sub, function(err, user) {
  //             if (!user) {
  //               return res.status(400).send({ message: 'User not found' });
  //             }
  //             user.facebook = profile.id;
  //             user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
  //             user.displayName = user.displayName || profile.name;
  //             user.save(function() {
  //               var token = createJWT(user);
  //               res.send({ token: token });
  //             });
  //           });
  //         });
  //       } else {
  //         // Step 3. Create a new user account or return an existing one.
  //         User.findOne({ facebook: profile.id }, function(err, existingUser) {
  //           if (existingUser) {
  //             var token = createJWT(existingUser);
  //             return res.send({ token: token });
  //           }
  //           var user = new User();
  //           user.facebook = profile.id;
  //           user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
  //           user.displayName = profile.name;
  //           user.save(function() {
  //             var token = createJWT(user);
  //             res.send({ token: token });
  //           });
  //         });
  //       }
  //     });
  //   });
  // });

  }


 /**
  * Logs the user in with facebook. Expects email and facebook in request object.
      Register new User
  * @param  req Request object
  * @param  res Response object
  * @param  next NextFunction that is called
  * @return 200 JSON of user object and auth token
  */
  public twitterLogin(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    return User.where({email : email}).fetch()
    .then((user) => {
      if(!user){
        throw new Error( "You are not registed. Please signup first");
      }
      else{
        req.user = user;
        return tokenHelpers.encodeToken(req.user.get('user_id'));
      }
    })
    .then((token) => {
      let filterPassword = req.user.toJSON();
      delete filterPassword['password'];
      res.status(200).json({
        success: 1,
        user: filterPassword,
        token: token
      });
    })
    .catch((err) => {
      return res.status(401).json({
        success: 0,
        message: err.message,
        data: err.data
      });
    });
  }
 
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/register', validate(AuthValidation.register), this.register);
    this.router.post('/login', validate(AuthValidation.login), this.login);
    this.router.post('/facebook/login', validate(AuthValidation.loginFacebook), this.facebookLogin);
    this.router.post('/facebook/register', validate(AuthValidation.registerFacebook), this.facebookRegister);
    this.router.post('/twitter/login', validate(AuthValidation.loginTwitter), this.twitterLogin);
    this.router.post('/twitter/register', validate(AuthValidation.registerTwitter), this.twitterRegister);
  }

}



// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
