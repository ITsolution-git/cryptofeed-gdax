process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const environment = "test";
const config = require('../../knexfile.js')[environment];
export var knex = require('knex')(config);

var util = require('util');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : group *********', function(){
  
  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
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
        res.body.success.should.eql(1);
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

  // describe('GET /api/v1/groups/3', () => {
  //   it('should return expected group', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/groups/3')
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       res.status.should.eql(200);
  //       res.type.should.eql('application/json');
  //       res.body.should.have.property('group');
  //       res.body.group.should.have.property('group_id');
  //       res.body.group.group_id.should.equal(3);
  //       done();
  //     });
  //   });
  // });

  // describe('POST /api/v1/groups', () => {
  //   it('should create a new group', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .post('/api/v1/groups')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({
  //         created_by_user_id: 1,
  //         name: 'TEST CREATE GROUP',
  //         private: 0,
  //         description: 'TEST CREATE GROUP DESCRIPTION',
  //         welcome: 'WELCOME TO THE TEST CREATE GROUP',
  //         banner_image_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
  //         latitude: '51.5032520',
  //         longitude: '-0.1278990'
  //       })
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.status.should.eql('success');
  //         res.body.should.have.property('group');
  //         res.body.group.should.have.property('name');
  //         res.body.group.name.should.equal('TEST CREATE GROUP');
  //         res.body.group.created_by_user_id.should.equal(1);
  //         done();
  //       });
  //     });
  //   });
  // });

  // describe('POST /api/v1/groups', () => {
  //   it('return 401 unauthorized', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/groups')
  //     .send({
  //       created_by_user_id: 1,
  //       name: 'TEST CREATE GROUP',
  //       private: 0,
  //       description: 'TEST CREATE GROUP DESCRIPTION',
  //       welcome: 'WELCOME TO THE TEST CREATE GROUP',
  //       banner_image_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
  //       latitude: '51.5032520',
  //       longitude: '-0.1278990'
  //     })
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(401);
  //       done();
  //     });
  //   });
  // });

  // describe('PUT /api/v1/groups/1', () => {
  //   it('should update group info and return updated group', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/groups/1')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({'name':'NEWLY UPDATED NAME','private':1})
  //       .end((err, resp) => {
  //         should.not.exist(err);
  //         resp.status.should.eql(200);
  //         resp.should.be.json;
  //         resp.body.should.be.a('object');
  //         resp.body.should.have.property('group');
  //         resp.body.group.should.have.property('group_id');
  //         resp.body.group.group_id.should.equal(1);
  //         resp.body.group.name.should.equal('NEWLY UPDATED NAME');
  //         resp.body.group.name.should.not.equal('Test Group 1');
  //         resp.body.group.private.should.equal(1);
  //         done();
  //       });
  //     });
  //   });
  //   it('should return an error when not logged in', (done) => {
  //     chai.request(app)
  //     .put('/api/v1/groups/1')
  //     .send({'name':'NEW','private':1})
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(401);
  //       done();
  //     });
  //   });
  // });

  // describe('POST /api/v1/groups/4/members', () => {
  //   it('should add user to the group', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .post('/api/v1/groups/4/members')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         done();
  //       });
  //     });
  //   });
  // });

  // describe('GET /api/v1/groups/1/members', () => {
  //   it('should return list of group members', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .get('/api/v1/groups/1/members')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('members');
  //         res.body.members[0].username.should.equal('seeder1');
  //         done();
  //       });
  //     });
  //   });
  // });

  // describe('PUT /api/v1/groups/1/members/2', () => {
  //   it('should update the specified member\'s group permissions ', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed1@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/groups/1/members/2')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({'mod_actions':1,'submit_action':1})
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('members');
  //         res.body.members[1].username.should.eql('seeder2');
  //         res.body.members[1].mod_actions.should.eql(1);
  //         res.body.members[1].submit_action.should.eql(1);
  //         res.body.members[1].admin_settings.should.eql(0);
  //         done();
  //       });
  //     });
  //   });
  // });

  // describe('PUT /api/v1/groups/1/members/2', () => {
  //   it('should return 401 unauthorized', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'seed2@test.net',
  //       password: 'password'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/groups/1/members/1')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({'mod_actions':0,'submit_action':0})
  //       .end((err, res) => {
  //         should.exist(err);
  //         res.status.should.eql(401);
  //         done();
  //       });
  //     });
  //   });
  // });

});
