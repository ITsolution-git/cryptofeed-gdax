import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import IdexTrade from './idex_trade';

export default bookshelf.Model.extend({
  tableName: 'idex_trades',
  hasTimestamps: true,
  idAttribute: 'idex_trade_id',

  initialize: function() {
  },


}, {

});