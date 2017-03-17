//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Npm Import
var crypto = require('crypto');
var util = require('util');
var moment = require('moment');

//Model Import
import bookshelf from '../db/bookshelf';
import User from '../db/models/user';
import Action from '../db/models/action';
//Helper Import
const toolHelpers = require('./_helpers');
/*
  Generate ramdom reset token.
  */
function generateResetToken(req: IRequest, res: Response, next: NextFunction) {
	const email = req.body.email;
	return User.where({email : email}).fetch()
	.then((user) => {
		if(!user){
      res.status(403).json({
        success: 0,
        message: "Sorry. We cannot find a user with that email."
      });
		}
		else{
			req.user = user;
			return crypto.randomBytes(2, function(err, buf) {
				var token = buf.toString('hex');
				return req.user.save({reset_password_token: token, 
							reset_password_expires: moment().add(process.env.EXPIRE_MINS, 'minutes').format("YYYY-MM-DD HH:MM:SS")
				})
				.then(user=>{
					next();
				})
			})
		}
	})
	.catch(err=>next(err));
}
/*
  Check if the reset_token is valid and not expired
  */
function checkValidToken(req: IRequest, res: Response, next: NextFunction) {
	const reset_token = req.body.reset_token;
	return User.where({reset_password_token : reset_token}).fetch()
	.then((user) => {
		if(!user){
      res.status(403).json({
        success: 0,
        message: "Sorry. The token is invalid"
      });
		}
		else{
			req.user = user;
			let expire = req.user.get('reset_password_expires');
			if(moment(expire) > moment())
				res.status(403).json({
					success: 0,
					message: "Sorry. The token is expired"
				});
			else
				next();
		}
	})
	.catch(err=>next(err));
}
module.exports = {
  generateResetToken,
	checkValidToken
};
