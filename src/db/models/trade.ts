import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import Trade from './trade';

export default bookshelf.Model.extend({
  tableName: 'trades',
  hasTimestamps: true,
  idAttribute: 'trade_id',

  initialize: function() {
  },


}, {

});