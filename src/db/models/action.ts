
// import bookshelf from '../bookshelf';

// import GroupUser from './group_user';
// import User from './user';
// import GroupSetting from './group_settings';
// import GroupTag from './group_tag';
// import Group from './group';

// const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
// export default bookshelf.Model.extend({
//   tableName: 'group',
//   hasTimestamps: true,
//   idAttribute: 'group_id',
//   users: function() {
//     return this.belongsToMany(User, 'group_user', 'group_id', 'user_id', 'group_id', 'user_id');
//   },
//   tags: function() {
//     // return this.hasMany(GroupTag, 'group_id', 'group_id').query({}).column(['tag']);
//     return this.hasMany(GroupTag, 'group_id', 'group_id');
    
//   },
//   settings: function() {
//     return this.hasMany(GroupSetting, 'group_id', 'group_id');
//   },
//   creator: function() {
//     return this.belongsTo(User, 'created_by_user_id', 'user_id');
//   },

//   initialize: function() {
//     this.on("saving", this._assertNameUnique);
//     this.on("saving", this._assertCodeUnique);
    
//     // if(this.isNew())
//     //   this.validations =  {
//     //     name: [
//     //       { method: 'isRequired', error:'Name Required'},
//     //     ],
//     //     group_code: [
//     //       { method: 'isRequired', error:'Group Code Required'},
//     //     ]
//     //   };
//     // else
//     //   this.validations =  {
//     //   };
//     // this.on('saving', this.validateOnSave);
//   },
 
//   _assertCodeUnique: function(model, attributes, options) {
//     if (this.hasChanged('group_code')) {
//       return Group
//         .query('where', 'group_code', this.get('group_code'))
//         .fetch({})
//         .then(function (existing) {
//           if (existing) throw new ValidationError('Choose Another Group Code');
//         });
//     }
//   },

//   _assertNameUnique: function(model, attributes, options) {
//     if (this.hasChanged('name')) {
//       return Group
//         .query('where', 'name', this.get('name'))
//         .fetch({})
//         .then(function (existing) {
//           if (existing) throw new ValidationError('Choose Another Name');
//         });
//     }
//   },
// }, {
 
// });