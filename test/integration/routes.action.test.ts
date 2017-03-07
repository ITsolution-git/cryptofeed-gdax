process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const environment = "test";
const config = require('../../knexfile.js')[environment];
export var knex = require('knex')(config);

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : auth *********', function(){

  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
    return knex.migrate.rollback();
  }); 
  describe('GET /api/v1/actions/{action_id}', () => {
    let token = "";
    it('should login with jasonh@actodo.co', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token');
        token = res.body.token;
        res.body.success.should.eql(1);
        done();
      });
    });
    it('should get action_id 1', (done) => {
      chai.request(app)
      .get('/api/v1/actions/1')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(1);
        done();
      });
    });

  });
  
  describe('POST /api/v1/actions/{action_id}/skip', () => {
    let token = "";
    it('should login with jasonh@actodo.co', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token');
        token = res.body.token;
        res.body.success.should.eql(1);
        done();
      });
    });
    it('should skip action_id 1', (done) => {
      chai.request(app)
      .post('/api/v1/actions/1/skip')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(1);
        done();
      });
    });

    it('should return error with skipping action_id 1 again', (done) => {
      chai.request(app)
      .post('/api/v1/actions/1/skip')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        console.log(res.body);
        should.exist(err);
        res.status.should.eql(405);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });


    it('should return error with skipping action_id 8:out of user\'s permission', (done) => {
      chai.request(app)
      .post('/api/v1/actions/8/skip')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        console.log(res.body);
        should.exist(err);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });
    it('should return error with skipping action_id 100 not found', (done) => {
      chai.request(app)
      .post('/api/v1/actions/100/skip')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(0);
        done();
      });
    });
  });
  
  describe('POST /api/v1/actions/{action_id}/complete', () => {
    let token = "";
    it('should login with jasonh@actodo.co', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token');
        token = res.body.token;
        res.body.success.should.eql(1);
        done();
      });
    });
    it('should complete action_id 1', (done) => {
      chai.request(app)
      .post('/api/v1/actions/1/complete')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(1);
        done();
      });
    });

    it('should return error with completing action_id 1 again', (done) => {
      chai.request(app)
      .post('/api/v1/actions/1/complete')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        console.log(res.body);
        should.exist(err);
        res.status.should.eql(405);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });
    it('should return error with completing action_id 8:out of user\'s permission', (done) => {
      chai.request(app)
      .post('/api/v1/actions/8/complete')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        console.log(res.body);
        should.exist(err);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });
    it('should return error with completing action_id 100 not found', (done) => {
      chai.request(app)
      .post('/api/v1/actions/100/complete')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(0);
        done();
      });
    });
  });

  describe('DELETE /api/v1/actions/{action_id}', () => {
    let token = "";
    it('should login with jasonh@actodo.co', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token');
        token = res.body.token;
        res.body.success.should.eql(1);
        done();
      });
    });
    it('should delete action_id 1', (done) => {
      chai.request(app)
      .del('/api/v1/actions/1')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(1);
        done();
      });
    });

    it('should return error with deleting action_id 1 again', (done) => {
      chai.request(app)
      .del('/api/v1/actions/1')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        console.log(res.body);
        should.exist(err);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });

    it('should return error with deleting action_id 8:out of user\'s permission', (done) => {
      chai.request(app)
      .del('/api/v1/actions/8')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        console.log(res.body);
        should.exist(err);
        //The action was deleted is fetched first than the permissio middleware
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });
    it('should return error with deleting action_id 100 not found', (done) => {
      chai.request(app)
      .del('/api/v1/actions/100')
	    .set('authorization', 'Bearer ' + token)
      .send({
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success');
        res.body.success.should.eql(0);
        done();
      });
    });
  });
});
