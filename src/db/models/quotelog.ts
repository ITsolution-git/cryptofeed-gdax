import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import Quotelog from './quotelog';

export default bookshelf.Model.extend({
  tableName: 'quotelog',
  idAttribute: 'priceid',

  initialize: function() {
  },

}, {

});