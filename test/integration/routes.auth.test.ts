process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const knex = require('../../src/db/connection');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : auth *********', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'jason@test.net',
        username: 'jasonh',
        password: 'password',
        first_name: 'jason',
        last_name: 'test',
        avatar_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
        bio: 'Jason is a great user. The best!',
        latitude: '51.5032520',
        longitude: '-0.1278990'
      })
      .end((err, res) => {
        should.not.exist(err);
        // res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('status', 'token');
        res.body.status.should.eql('success');
        done();
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should log in a registered user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((err, res) => {
        should.not.exist(err);
        //res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('status', 'token');
        res.body.status.should.eql('success');
        should.exist(res.body.token);
        done();
      });
    });

    it('should not log in an unregistered user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'nouser',
        password: 'password'
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.status.should.eql('error');
        done();
      });
    });
  });
});
