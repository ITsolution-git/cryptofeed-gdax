
import bookshelf from '../bookshelf';
var _ = require('lodash');

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
import bluebird from 'bluebird';
import Group from './group';

export default bookshelf.Model.extend({
  tableName: 'group_tag',
  hasTimestamps: true,
  idAttribute: 'group_tag_id',

  initialize: function() {

    this.on('saving', this.validateOnSave);
  },
  validations : {
    tag: [
        { method: 'isRequired', error: 'Tag is required'}, 
  
    ],
  },
  group: function() {
    return this.belongsTo(Group, 'group_id', 'group_id');
  },
  

}, {

});