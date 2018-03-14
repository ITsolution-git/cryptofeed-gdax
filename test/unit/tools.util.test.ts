
describe('unit - signer', function () {
  let assert = require('assert')
  describe('URI()', function () {
    it('should form correct payment url', function (done) {
      let util = require('./../../src/tools/util')
      let url = util.URI({
        address: '3Bsssbs4ANCGNETvGLJ3Fvri6SiVnH1fbi',
        message: 'For goods & services',
        label: 'nolabel',
        amount: 1000000,
        currency: 'BTC'
      })
      assert.equal(url, 'bitcoin:3Bsssbs4ANCGNETvGLJ3Fvri6SiVnH1fbi?amount=1000000&message=For%20goods%20%26%20services&label=nolabel')

      url = util.URI({
        address: '1DzJepHCRD2C9vpFjk11eXJi97juEZ3ftv',
        message: 'wheres the money lebowski',
        amount: 400000,
        currency: 'BTC'
      })
      assert.equal(url, 'bitcoin:1DzJepHCRD2C9vpFjk11eXJi97juEZ3ftv?amount=400000&message=wheres%20the%20money%20lebowski')
      done()
    })
  })
})