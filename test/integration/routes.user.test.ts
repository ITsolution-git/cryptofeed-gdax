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

describe('********* routes : user *********', function(){
  
  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/user', () => {
    it('should return a success and correct user object', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .get('/api/v1/user')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.success.should.eql(1);
          res.body.should.have.property('user');
          res.body.user.should.have.property('username');
          res.body.user.username.should.equal('jasonh');

          done();
        });
      });
    });

    it('should return a success and correct user object on /user/1', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .get('/api/v1/user/1')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          console.log(err);
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.success.should.eql(1);
          res.body.should.have.property('user');
          res.body.user.should.have.property('username');
          res.body.user.username.should.equal('jasonh');

          done();
        });
      });
    });

    it('should throw an error if a user is not logged in', (done) => {
      chai.request(app)
      .get('/api/v1/user')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.message.should.eql('Authentication required');
        done();
      });
    });

  });

  describe('GET /api/v1/user/groups', () => {
    it('should return a json array of groups', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .get('/api/v1/user/groups')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.success.should.eql(1);
          res.body.groups.should.have.length(2);
          done();
        });
      })
    });
    it('should return an error when not logged in', (done) => {
      chai.request(app)
      .get('/api/v1/user/groups')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.message.should.eql('Authentication required');
        done();
      });
    });
  });

  describe('PUT /api/v1/user', () => {
    var token = "";
    it('should return a json array of updated user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .put('/api/v1/user')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({'first_name':'NEW','last_name':'NAME', email:"again@a.com"})
        .end((err, res) => {
          res.status.should.eql(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('first_name');
          res.body.user.should.have.property('last_name');
          res.body.user.first_name.should.equal('NEW');
          res.body.user.last_name.should.equal('NAME');
          console.log("Changed firstname : " + res.body.user.first_name);
          token = response.body.token;
          done();
        });
      });
    });

    it('should return an error when not logged in', (done) => {
      chai.request(app)
      .put('/api/v1/user')
      .send({'first_name':'NEW','last_name':'NAME'})
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.message.should.eql('Authentication required');
        done();
      });
    });
    it('should save email to:erwin@g.com', (done) => {
      chai.request(app)
      .put('/api/v1/user')
      .set('authorization', 'Bearer ' + token)
      .send({'email':'erwin@g.com'})
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.have.property('user');
        res.body.user.should.have.property('email');
        res.body.user.email.should.equal('erwin@g.com'); 
        done();
      });
    });

    it('should change password to:newpassword and success login', (done) => {
      chai.request(app)
      .put('/api/v1/user')
      .set('authorization', 'Bearer ' + token)
      .send({'password':'newpassword'})
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.have.property('user');
        chai.request(app)
        .post('/api/v1/auth/login')
        .set('authorization', 'Bearer ' + token)
        .send({'email':'erwin@g.com', 'password':'newpassword'})
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.should.include.keys('user', 'token');
          done(); 
        })
      });
    });
  });


  describe('GET /api/v1/user/groups', () => {
    var token = "";
    it('should return a groups of jasonh@actodo.co', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'erwin@g.com',
        password: 'newpassword'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .get('/api/v1/user/groups')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({})
        .end((err, res) => {
          res.status.should.eql(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('groups', 'success');
          res.body.success.should.equal(1);
          res.body.groups.should.be.a('array');
          res.body.groups.should.have.length(2);
          res.body.groups[0].should.include.keys('group_id');
          done();
        });
      });
    });
  });
  

  describe('PUT /api/v1/user/password', () => {
    var token = "";
    it('should change password', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'erwin@g.com',
        password: 'newpassword'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .put('/api/v1/user/password')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({original_password:"newpassword", new_password:"password"})
        .end((err, res) => {
          res.status.should.eql(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('user', 'success', 'token');
          res.body.success.should.equal(1);
          done();
        });
      });
    });

  });
});
