process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const environment = "test";
const config = require('../../knexfile.js')[environment];
export var knex = require('knex')(config);

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : auth *********', function(){

  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
    return knex.migrate.rollback();
  }); 

  
});
