import {Request} from 'express';
var User = require('../db/models/user');
export interface IRequest extends Request{
  user: any,
  files: any
}
