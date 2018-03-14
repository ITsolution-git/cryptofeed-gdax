const bcrypt = require('bcryptjs');
var util = require('util');

process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';

const should = chai.should();

const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync('testpassword', salt);
const helpers = require('../../src/tools/_helpers');


describe('auth : helpers', () => {

  describe('simple', () => {
    it('should return true', (done) => {
      let output = true;
      should.exist(output);
      output.should.eql(true);
      done();
    });
  });

});
