process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const knex = require('../../src/db/connection');
var util = require('util');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : group actions *********', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/groups/1/actions', () => {
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
        .get('/api/v1/groups/1/actions')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.should.have.property('actions');
          res.body.actions[0].should.have.property('group_id');
          res.body.actions[0].group_id.should.eql(1);
          done();
        });
      });
    });
  });
});
