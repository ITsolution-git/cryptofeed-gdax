import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import Order from './order';

export default bookshelf.Model.extend({
  tableName: 'order',
  hasTimestamps: true,
  idAttribute: 'order_id',

  initialize: function() {
  },


}, {

});