import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import Quote from './quote';

export default bookshelf.Model.extend({
  tableName: 'quote',
  idAttribute: 'symbol',

  initialize: function() {
  },

}, {

});