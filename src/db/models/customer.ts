
import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import Customer from './customer';

export default bookshelf.Model.extend({
  tableName: 'customer',
  hasTimestamps: true,
  idAttribute: 'customer_id',

  initialize: function() {
    // this.on("saving", this._assertEmailUnique);
  },


  // _assertEmailUnique: function(model, attributes, options) {
  //   if (this.hasChanged('email')) {
  //     return Customer
  //       .query('where', 'email', this.get('email'))
  //       .fetch({})
  //       .then(function (existing) {
  //         if (existing) throw new Error('Customer Email Duplicated. Choose Another Email');
  //       });
  //   }
  // }
}, {

});