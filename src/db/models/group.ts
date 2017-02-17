
var bookshelf = require('../connection');

import GroupUser from './group_user';
import User from './user';

export default bookshelf.Model.extend({
  tableName: 'group',
  hasTimestamps: true,
  idAttribute: 'group_id',
  users: function() {
    return this.belongsToMany(User, 'group_user', 'group_id', 'user_id', 'group_id', 'user_id').through(GroupUser);
  }
}, {
 
});