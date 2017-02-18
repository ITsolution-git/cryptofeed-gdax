process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
// const knex = require('../../src/db/connection');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : user *********', () => {
  // beforeEach(() => {
  //   return knex.migrate.rollback()
  //   .then(() => { return knex.migrate.latest(); })
  //   .then(() => { return knex.seed.run(); });
  // });

  // afterEach(() => {
  //   return knex.migrate.rollback();
  // });

  // describe('GET /api/v1/user', () => {
  //   it('should return a success and correct user object', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .get('/api/v1/user')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.status.should.eql('success');
  //         res.body.should.have.property('user');
  //         res.body.user.should.have.property('username');
  //         res.body.user.username.should.equal('seeder1');

  //         done();
  //       });
  //     });
  //   });
  //   it('should throw an error if a user is not logged in', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/user')
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(400);
  //       res.type.should.eql('application/json');
  //       res.body.status.should.eql('Authentication required');
  //       done();
  //     });
  //   });
  // });

  // describe('GET /api/v1/user/groups', () => {
  //   it('should return a json array of groups', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .get('/api/v1/user/groups')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.status.should.eql('success');
  //         done();
  //       });
  //     })
  //   });
  //   it('should return an error when not logged in', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/user/groups')
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(400);
  //       res.type.should.eql('application/json');
  //       res.body.status.should.eql('Authentication required');
  //       done();
  //     });
  //   });
  // });

  // describe('PUT /api/v1/user', () => {
  //   it('should return a json array of updated user', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/user')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({'first_name':'NEW','last_name':'NAME'})
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('user');
  //         res.body.user.should.have.property('first_name');
  //         res.body.user.should.have.property('last_name');
  //         res.body.user.first_name.should.equal('NEW');
  //         res.body.user.last_name.should.equal('NAME');
  //         done();
  //       });
  //     })
  //   });
  //   it('should return an error when not logged in', (done) => {
  //     chai.request(app)
  //     .put('/api/v1/user')
  //     .send({'first_name':'NEW','last_name':'NAME'})
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(400);
  //       res.type.should.eql('application/json');
  //       res.body.status.should.eql('Authentication required');
  //       done();
  //     });
  //   });
  // });
});
