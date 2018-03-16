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

describe('********* routes : account *********', function(){

  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
    return knex.migrate.rollback();
  }); 

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'newuser@test.net',
        password: 'password',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token');
        res.body.success.should.eql(1);
        done();
      });
    });
    it('should return error with the same email register', (done) => {
      chai.request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'newuser@test.net',
        password: 'password',
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'data');
        res.body.success.should.eql(0);
        res.body.data.should.eql("User Email Duplicated. Choose Another Email");
        done();
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with a new user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@btccard.com.au',
        password: 'letmein',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token', 'user');
        res.body.success.should.eql(1);
        done();
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should not login with unregistered user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'unregistered@test.net',
        password: 'password',
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        res.body.message.should.eql("Invalid email address");
        done();
      });
    });
  });


  describe('POST /api/v1/auth/login', () => {
    it('should log in a registered user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@btccard.com.au',
        password: 'letmein'
      })
      .end((err, res) => {
        should.not.exist(err);
        //res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'token', 'user');
        res.body.success.should.eql(1);
        should.exist(res.body.token);
        done();
      });
    });

    it('should not log in invalid password', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'jasonh@actodo.co',
        password: 'wrongpassword'
      })
      .end((err, res) => {
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        res.body.should.include.keys('success', 'message');
        res.body.success.should.eql(0);
        done();
      });
    });
  });


});

describe('********* routes : acount *********', function(){
  
  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/account/me', () => {
    it('should return a success and correct user object', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@btccard.com.au',
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
          res.body.user.should.have.property('email');

          done();
        });
      });
    });

    it('should throw an error if a user is not logged in', (done) => {
      chai.request(app)
      .get('/api/v1/account/me')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.message.should.eql('Authentication required');
        done();
      });
    });

  });

  describe('PUT /api/v1/account', () => {
    var token = "";
    it('should return a json array of updated user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@btccard.com.au',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .put('/api/v1/account')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({'first_name':'NEW','last_name':'NAME', email:"admin@test.com"})
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
      .put('/api/v1/account')
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
      .put('/api/v1/account')
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
      .put('/api/v1/account')
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


  // describe('GET /api/v1/user/actions', () => {
  //   var token = "";
  //   it('should return a json array of action of group user belongs to', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'erwin@g.com',
  //       password: 'newpassword'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .get('/api/v1/user/actions')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         console.log(err);
  //         res.status.should.eql(200);
  //         res.should.be.json; 
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('actions');
  //         token = response.body.token;
  //         done();
  //       });
  //     });
  //   });
  // });

  // describe('GET /api/v1/user/groups', () => {
  //   var token = "";
  //   it('should return a groups of jasonh@actodo.co', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'erwin@g.com',
  //       password: 'newpassword'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .get('/api/v1/user/groups')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({})
  //       .end((err, res) => {
  //         res.status.should.eql(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         res.body.should.include.keys('groups', 'success');
  //         res.body.success.should.equal(1);
  //         res.body.groups.should.be.a('array');
  //         res.body.groups.should.have.length(2);
  //         res.body.groups[0].should.include.keys('group_id');
  //         done();
  //       });
  //     });
  //   });
  // });
  

  // describe('PUT /api/v1/user/password', () => {
  //   var token = "";
  //   it('should change password', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'erwin@g.com',
  //       password: 'newpassword'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/user/password')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({original_password:"newpassword", new_password:"password"})
  //       .end((err, res) => {
  //         res.status.should.eql(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         res.body.should.include.keys('user', 'success', 'token');
  //         res.body.success.should.equal(1);
  //         done();
  //       });
  //     });
  //   });

  // });
});
