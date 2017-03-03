
import bookshelf from '../bookshelf';

import GroupUser from './group_user';
import User from './user';
import GroupSetting from './group_settings';
import GroupTag from './group_tag';
import Group from './group';
import ActionType from './action_type';

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
export default bookshelf.Model.extend({
  tableName: 'action',
  hasTimestamps: true,
  idAttribute: 'action_id',

  action_type: function() {
    return this.belongsTo(ActionType, 'action_type_id', 'action_type_id');
  },
  creator: function() {
    return this.belongsTo(User, 'created_by_user_id', 'user_id').query(function(qb){
      qb.column('user_id', 'first_name', 'last_name', 'avatar_file', 'username'); });
  },
  deletor: function() { 
    return this.belongsTo(User, 'deleted_by_user_id', 'user_id');
  },

  initialize: function() {
  },
 
}, {
  getAction: function(action_id: number){
    return this.where({action_id:action_id}).fetch({withRelated:[
    {'creator':function(qb) {
        qb.column('user_id', 'first_name', 'last_name', 'avatar_file');
    }},
    'action_type']})
  }
});