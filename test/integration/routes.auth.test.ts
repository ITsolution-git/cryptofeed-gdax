process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
// const bookshelf = require('../../src/db/bookshelf');
// import bookshelf from '../../src/db/bookshelf';
const environment = "test";
const config = require('../../knexfile.js')[environment];
export var knex = require('knex')(config);

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : auth *********', function(){

    this.timeout(1500000);
  // this.timeout(5000);
  beforeEach((done) => {

    return knex.migrate.rollback()
    .then(() => { console.log("sssssssssssssssssssssssssSSS"); return knex.migrate.latest(); })
    .then(() => { console.log("sssssssssssssssssssssssssSSS"); return knex.seed.run(); })
    .then(() => { console.log("sssssssssssssssssssssssssSSS"); done() });
  });

  afterEach((done) => {
    return knex.migrate.rollback()
    .then(() => { return done() });
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
  });

  // describe('POST /api/v1/auth/login', () => {
  //   it('should log in a registered user', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       //res.redirects.length.should.eql(0);
  //       res.status.should.eql(200);
  //       res.type.should.eql('application/json');
  //       res.body.should.include.keys('status', 'token');
  //       res.body.status.should.eql('success');
  //       should.exist(res.body.token);
  //       done();
  //     });
  //   });

  //   it('should not log in an unregistered user', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       username: 'nouser',
  //       password: 'password'
  //     })
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(401);
  //       res.type.should.eql('application/json');
  //       res.body.status.should.eql('error');
  //       done();
  //     });
  //   });
  // });
});
