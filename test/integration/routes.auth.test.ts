process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const knex = require('../../src/db/connection');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('routes : auth', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /api/v1/auth/register', () => {

  it('should register a new user', (done) => {
    chai.request(app)
    .post('/api/v1/auth/register')
    .send({
      email: 'jeremy@test.net',
      username: 'jeremyt',
      password: 'password',
      first_name: 'jeremy',
      last_name: 'test',
      avatar_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
      bio: 'Jeremy is a great tester. The best!',
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

});
