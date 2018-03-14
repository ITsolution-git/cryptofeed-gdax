process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';

const should = chai.should();
const localAuth = require('../../src/tools/tokens');

describe('auth : local', function(){

  this.timeout(5000)
  describe('encodeToken()', () => {
    it('should return a token', (done) => {
      const results = localAuth.encodeToken({user_id: 1});
      should.exist(results);
      results.should.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    it('should return a payload', (done) => {
      const results = localAuth.encodeToken({user_id: 1});
      should.exist(results);
      localAuth.decodeToken(results).then((res) => {
        res.sub.should.eql(1);
      });
      done();
    });
  });

});
