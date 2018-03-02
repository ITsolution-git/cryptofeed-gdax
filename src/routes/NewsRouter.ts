import {Router, Request, Response, NextFunction} from 'express';
import {IRequest} from '../classes/IRequest';

const toolHelpers = require('../tools/_helpers');
const validate = require('../classes/ParamValidator');


import bluebird from 'bluebird';
var util = require('util');
import News from '../db/models/news';

export class NewsRouter {
  router: Router

  /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  } 

  public postNews(req: IRequest, res: Response, next: NextFunction) {
    req.body.author_id = req.user.get('user_id');
    return new News(req.body).save()
    .then((news) => {        
      res.status(200).json({
        success: 1,
        data: news
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
    
  }

  public getNews(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return News.where({news_id:parseInt(req.params.id)}).fetch()
      .then((news) => {        
        if(news)
          res.status(200).json({
            success: 1,
            data: news
          });
        else 
          res.status(404).json({
            success: 0,
            message: "News Not Exist"
          });
      })
      .catch(function(err){
        res.status(400).json({
          success: 0,
          message: err.message
        })
      });
    } else {
      res.status(403).json({
        success: 0,
        message: 'News ID is required'
      });
    }
  }

  public getNewss(req: IRequest, res: Response, next: NextFunction) {
    return News.where({}).fetchAll({withRelated: [
      {
      'author': function(qb) {
        qb.column('user_id', 'first_name', 'last_name', 'email');
      }}
    ]})
    .then((newss) => {        
      res.status(200).json({
        success: 1,
        data: newss
      });
    })
    .catch(function(err){
      res.status(400).json({
        success: 0,
        message: err.message
      })
    });
  }

  public putNews(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return News.where({news_id:parseInt(req.params.id)}).fetch()
      .then((news) => {        
        if(news)
          return news.save(req.body);
          
        else 
          res.status(404).json({
            success: 0,
            message: "News Not Exist"
          });
      })
      .then(function(news){
        res.status(200).json({
          success: 1,
          data: news
        });
      })
      .catch(function(err){
        res.status(400).json({
          success: 0,
          message: err.message
        })
      });
    } else {
      res.status(403).json({
        success: 0,
        message: 'News ID is required'
      });
    }
  }
  
  public deleteNews(req: IRequest, res: Response, next: NextFunction) {
    if(req.params.id) {
      return News.where({news_id:parseInt(req.params.id)}).fetch()
      .then((news) => {        
        if(news)
          return news.destroy();
          
        else 
          res.status(404).json({
            success: 0,
            message: "News Not Exist"
          });
      })
      .then(function(news){
        res.status(200).json({
          success: 1,
          message: 'News Deleted'
        });
      })
      .catch(function(err){
        res.status(400).json({
          success: 0,
          message: err.message
        })
      });
    } else {
      res.status(403).json({
        success: 0,
        message: 'News ID is required'
      });
    }
  }
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {  
    // Routes for /api/v1/user
    this.router.post('/', toolHelpers.ensureAuthenticated, toolHelpers.isAdmin, this.postNews);
    this.router.get('/:id', this.getNews);
    this.router.get('/', this.getNewss);
    this.router.put('/:id', toolHelpers.ensureAuthenticated, toolHelpers.isAdmin, this.putNews);
    this.router.delete('/:id',toolHelpers.ensureAuthenticated, toolHelpers.isAdmin, this.deleteNews);
  }

}

// Create the AuthRouter, and export its configured Express.Router
const newsRoutes = new NewsRouter();
newsRoutes.init();

export default newsRoutes;
