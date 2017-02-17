
var bookshelf = require('../connection');
import User from './user';
import Group from './group';

export default bookshelf.Model.extend({
  tableName: 'group_user',
  hasTimestamps: true,
  idAttribute: 'group_user_id', 
  user: function() {
    return this.belongsTo(User);
  },
  group: function() {
    return this.belongsTo(Group);
  }
}, {
 
});