process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const knex = require('../../src/db/connection');
var util = require('util');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : group *********', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/groups', () => {
    it('should return a success', (done) => {
      chai.request(app)
      .get('/api/v1/groups')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        done();
      });
    });

    it('should return array of groups', (done) => {
      chai.request(app)
      .get('/api/v1/groups')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.have.property('groups');
        done();
      });
    });
  });

  describe('GET /api/v1/groups/:id', () => {
    it('should return expected group', (done) => {
      chai.request(app)
      .get('/api/v1/groups/3')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.have.property('group');
        res.body.group.should.have.property('group_id');
        res.body.group.group_id.should.equal(3);
        done();
      });
    });
  });

  describe('POST /api/v1/groups', () => {
    it('should create a new group', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .post('/api/v1/groups')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({
          created_by_user_id: 1,
          name: 'TEST CREATE GROUP',
          private: 0,
          description: 'TEST CREATE GROUP DESCRIPTION',
          welcome: 'WELCOME TO THE TEST CREATE GROUP',
          banner_image_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
          latitude: '51.5032520',
          longitude: '-0.1278990'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.should.have.property('group');
          res.body.group.should.have.property('name');
          res.body.group.name.should.equal('TEST CREATE GROUP');
          res.body.group.created_by_user_id.should.equal(1);
          done();
        });
      });
    });
  });
});
