
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
    // return this.hasMany(GroupTag, 'group_id', 'group_id').query({}).column(['tag']);
    return this.hasMany(GroupTag, 'group_id', 'group_id');
    
  },
  settings: function() {
    return this.hasMany(GroupSetting, 'group_id', 'group_id');
  },
  creator: function() {
    return this.belongsTo(User, 'created_by_user_id', 'user_id');
  },

  initialize: function() {
    // this.on("saving", this._assertEmailUnique);
    // this.on("saving", this._assertUsernameUnique);
    
    this.on('saving', this.validateOnSave);
  },
  // validations:{
  //   email: [
  //     { method: 'isRequired', error:'Email Required'},
  //     { isEmail: {allow_display_name: true} }, // Options object passed to node-validator
  //     // { method: 'isLength', error: 'Username 4-32 characters long.', args: [4, 32] } // Custom error message
  //   ],
  //   password: [
  //     { method: 'isRequired', error:'Password Required'},
  //     { method: 'isLength', error: 'Password shoud be longer than 6.', args: [6] }, // Custom error message
  //   ]
  // };
  // _assertEmailUnique: function(model, attributes, options) {
  //   if (this.hasChanged('email')) {
  //     return User
  //       .query('where', 'email', this.get('email'))
  //       .fetch({})
  //       .then(function (existing) {
  //         if (existing) throw new ValidationError('Choose Another Email');
  //       });
  //   }
  // },
}, {
 
});