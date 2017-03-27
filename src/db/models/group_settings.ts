
import bookshelf from '../bookshelf';
var _ = require('lodash');

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
import bluebird from 'bluebird';
import Group from './group';

export default bookshelf.Model.extend({
  tableName: 'group_settings',
  hasTimestamps: true,
  idAttribute: 'group_setting_id',

  initialize: function() {

    this.on('saving', this.validateOnSave);
  },
  validations : {
    // allow_member_action: [
    //     { method: 'isRequired', error: 'Allow member actions is required'}, 
  
    // ],
  },
  group: function() {
    return this.belongsTo(Group, 'group_id', 'group_id');
  },
  

}, {

});