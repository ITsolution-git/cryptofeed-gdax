import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import BittrexTrade from './bittrex_trade';

export default bookshelf.Model.extend({
  tableName: 'bittrex_trades',
  hasTimestamps: true,
  idAttribute: 'bittrex_trade_id',

  initialize: function() {
  },


}, {

});