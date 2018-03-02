import bookshelf from '../bookshelf';

import bluebird from 'bluebird';
import News from './news';
import User from './user';

export default bookshelf.Model.extend({
  tableName: 'news',
  hasTimestamps: true,
  idAttribute: 'news_id',

  initialize: function() {
  },

  author: function() {
    return this.belongsTo(User, 'author_id', 'user_id');
  },

}, {

});