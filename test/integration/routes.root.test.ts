process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
// const knex = require('../../src/db/connection');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : api root *********', () => {

  beforeEach(() => {

  });

  afterEach(() => {

  });

  // describe('GET /api/v1/', () => {
  //   it('should be json', (done) => {
  //     chai.request(app)
  //     .get('/api/v1')
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       // res.redirects.length.should.eql(0);
  //       res.status.should.eql(204);
  //       res.type.should.eql('application/json');
  //       done();
  //     });
  //   });

  //   it('should have a message prop', (done) => {
  //     chai.request(app)
  //     .get('/api/v1')
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       // res.redirects.length.should.eql(0);
  //       res.status.should.eql(204);
  //       res.type.should.eql('application/json');
  //       res.body.should.include.keys('success', 'message');
  //       res.body.success.should.eql(1);
  //       res.body.message.should.eql('Action Now API v1.0');
  //       done();
  //     });
  //   });
  // });
});
