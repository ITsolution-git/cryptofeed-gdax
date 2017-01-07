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
    it('should return all actions for a group', (done) => {
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
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.should.have.property('actions');
          res.body.actions.length.should.eql(2);
          res.body.actions[0].should.have.property('group_id');
          res.body.actions[0].group_id.should.eql(1);
          done();
        });
      });
    });
  });

  describe('POST /api/v1/groups/1/actions', () => {
    it('should create a new group action', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .post('/api/v1/groups/1/actions')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({
            action_type_id: 1,
            title: 'TEST CREATE GROUP 1 ACTION EMAIL',
            description: 'TEST CREATE GROUP 1 DESCRIPTION',
            thanks_msg: 'TEST CREATE GROUP 1 THANKS MESSAGE',
            points: 100,
            start_at: '2017-03-01 10:00:00',
            end_at: '2017-03-01 18:00:00',
            param1: 'test@test.net',
            param2: 'Test Subject',
            param3: 'Test Body'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.should.have.property('action');
          res.body.action.should.have.property('group_id');
          res.body.action.group_id.should.eql(1);
          res.body.action.title.should.eql('TEST CREATE GROUP 1 ACTION EMAIL');
          res.body.action.points.should.eql(100);
          res.body.action.action_type_id.should.eql(1);
          done();
        });
      });
    });
  });

  describe('GET /api/v1/groups/1/actions/1', () => {
    it('should get the action for id 1', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .get('/api/v1/groups/1/actions/1')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.should.have.property('action');
          res.body.action.should.have.property('group_id');
          res.body.action.group_id.should.eql(1);
          res.body.action.should.have.property('action_id');
          res.body.action.action_id.should.eql(1);
          done();
        });
      });
    });
  });

  describe('POST /api/v1/groups/1/actions/1/complete', () => {
    it('marks an action complete for a user', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .post('/api/v1/groups/1/actions/1/complete')
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

    it('should throw an error if user already marked complete', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .post('/api/v1/groups/1/actions/1/complete')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          // TODO: Make sure function returns error if user has already completed action
          // should.exist(err);
          // res.status.should.eql(401);
          // res.body.status.should.eql('error');
          done();
        });
      });
    });
  });

  describe('GET /api/v1/groups/1/actions/types', () => {
    it('returns array of supported action types', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .get('/api/v1/groups/1/actions/types')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.should.have.property('action_types');
          res.body.action_types[0].should.have.property('action_type_id');
          res.body.action_types[0].action_type_id.should.eql(1);
          done();
        });
      });
    });
  });

  describe('DELETE /api/v1/groups/1/actions/1', () => {
    it('deletes an action', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .del('/api/v1/groups/1/actions/1')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('REMOVED');
          res.body.REMOVED.should.be.a('object');
          res.body.REMOVED.should.have.property('action_id');
          res.body.REMOVED.action_id.should.equal(1);
          done();
        });
      });
    });
  });

  describe('PUT /api/v1/groups/1/actions/1', () => {
    it('updates an action', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'seeder1',
        password: 'password'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .put('/api/v1/groups/1/actions/1')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({'title':'NEW TITLE','description':'NEW DESCRIPTION'})
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('action');
          res.body.action.should.have.property('title');
          res.body.action.title.should.eql('NEW TITLE');
          res.body.action.should.have.property('description');
          res.body.action.description.should.eql('NEW DESCRIPTION');
          done();
        });
      });
    });
  });

});
