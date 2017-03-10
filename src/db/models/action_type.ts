
import bookshelf from '../bookshelf';

import Action from './action';

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
export default bookshelf.Model.extend({
  tableName: 'action_type',
  hasTimestamps: false,
  idAttribute: 'action_type_id',
  action: function() {
    // return this.hasMany(GroupTag, 'group_id', 'group_id').query({}).column(['tag']);
    return this.hasMany(Action, 'action_type_id', 'action_type_id');
    
  },

  initialize: function() {
  },
}, {
 
});