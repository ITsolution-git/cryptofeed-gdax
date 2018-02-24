//Express Import
import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';
//Model Import
import User from '../db/models/user';
import Order from '../db/models/order';
//Validation Import
import AuthValidation from '../validations/AuthValidation';
const validate = require('../classes/ParamValidator');
//Npm Import
var request = require('request');
var util = require('util');
//Helpers Import
const tokenHelpers = require('../tools/tokens'); 
const AuthHelpers = require('../tools/auth_helpers');
//Smpt Transfer
// import smtpTransport from '../config/smtpTransport';
// const sendgrid = require('../config/config').sendgrid;
// const sghelper = require('sendgrid').mail;

const signer = require('../tools/signer');
const blockchain = require('../tools/blockchain');

let express = require('express')
let router = express.Router()
let qr = require('qr-image')
let crypto = require('crypto')
let fs = require('fs')

export class StaticRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public generate_qr(req: IRequest, res: Response, next: NextFunction) {
    let filename
    let qrSvg
    filename = 'public/qr/' + crypto.createHash('sha1').update(decodeURIComponent(req.params.text)).digest('hex') + '.png'

    qrSvg = qr.image(decodeURIComponent(req.params.text), { type: 'png' })
    qrSvg.pipe(fs.createWriteStream(filename))
    qrSvg.on('end', function () {
      res.redirect(301, '/' + filename.slice(7))
      console.log('/' + filename.slice(7));
      res.end()
    })
    qrSvg.on('error', function () {
      res.send('QR file error')
      res.end()
    })
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/generate_qr/:text',  this.generate_qr);
  }

}



// Create the AuthRouter, and export its configured Express.Router
const staticRoutes = new StaticRouter();
staticRoutes.init();

export default staticRoutes;
