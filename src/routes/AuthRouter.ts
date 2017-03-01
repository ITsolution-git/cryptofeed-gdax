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
      req.user = user.toJSON();
      delete req.user['password'];
      return tokenHelpers.encodeToken(user.get('user_id'));
    })
    .then((token) => {
      res.status(200).json({
        success: 1,
        user: req.user,
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
        message: err.message
      });
    });
  }

  public loginFacebook(req: IRequest, res: Response, next: NextFunction) {
    const email = req.body.email;
    return User.where({email : email}).fetch()
    .then((user) => {
      if(!user){
        return new User(req.body).save()
        .then((user) => {
          req.user = user.toJSON();
          delete req.user['password'];
          return user;
        })
      }
      else{
        req.user = user.toJSON();
        delete req.user['password'];
        return user;
      }
    })
    .then((user) => {
      return tokenHelpers.encodeToken(user.id);
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
        message: err.message
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
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/register', validate(AuthValidation.register), this.register);
    this.router.post('/login', validate(AuthValidation.login), this.login);
    this.router.post('/facebook', validate(AuthValidation.loginFacebook), this.loginFacebook);
  }

}



// Create the AuthRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
