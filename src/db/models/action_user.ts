
import bookshelf from '../bookshelf';

import GroupUser from './group_user';
import User from './user';
import GroupSetting from './group_settings';
import GroupTag from './group_tag';
import Group from './group';
import Action from './action';

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
export default bookshelf.Model.extend({
  tableName: 'action_user',
  hasTimestamps: true,
  idAttribute: 'action_user_id',
  user: function() {
    return this.belongsTo(User);
  },
  action: function() {
    return this.belongsTo(Action);
  },

  initialize: function() {
  },
 
}, {
 
});