
import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import Coupon from './coupon';

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
export default bookshelf.Model.extend({
  tableName: 'coupon',
  hasTimestamps: true,
  idAttribute: 'coupon_id',

  initialize: function() {
    this.on("saving", this._assertCodeUnique);
  },

  _assertCodeUnique: function(model, attributes, options) {
    if (this.hasChanged('code')) {
      return Coupon
        .query('where', 'code', this.get('code'))
        .fetch({})
        .then(function (existing) {
          if (existing) throw new Error('Code Repeated. Choose Another Code.');
        });
    }
  },
}, {

});