process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const knex = require('../../src/db/connection');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('routes : user', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/user', () => {
    it('should return a success', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
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
          res.body.status.should.eql('success');
          done();
        });
      });
    });
    it('should throw an error if a user is not logged in', (done) => {
      chai.request(app)
      .get('/api/v1/user')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        res.body.status.should.eql('Authentication required');
        done();
      });
    });
  });
});
