
import bookshelf from '../bookshelf';

import GroupUser from './group_user';
import User from './user';
import GroupSetting from './group_settings';
import GroupTag from './group_tag';

export default bookshelf.Model.extend({
  tableName: 'group',
  hasTimestamps: true,
  idAttribute: 'group_id',
  users: function() {
    return this.belongsToMany(User, 'group_user', 'group_id', 'user_id', 'group_id', 'user_id');
  },
  tags: function() {
    return this.hasMany(GroupTag, 'group_id', 'group_id');
  },
  settings: function() {
    return this.hasMany(GroupSetting, 'group_id', 'group_id');
  },
  creator: function() {
    return this.belongsTo(User, 'created_by_user_id', 'user_id');
  }
}, {
 
});