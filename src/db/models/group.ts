
import bookshelf from '../bookshelf';

import GroupUser from './group_user';
import User from './user';
import GroupSetting from './group_settings';
import GroupTag from './group_tag';
import Group from './group';
import Action from './action';

var moment = require('moment');
const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
//Helpers Import
const toolHelpers = require('../../tools/_helpers');

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
  setting: function() {
    return this.hasOne(GroupSetting, 'group_id', 'group_id');
  },
  creator: function() {
    var data = this.belongsTo(User, 'created_by_user_id', 'user_id');
    return data;
  },
  /* all actions
  */
  actions: function(){
    return this.hasMany(Action, 'group_id', 'group_id').query(function(qb){
    });
  },
  /* not deleted actions
     open actions
     actions ended in 2 months ago
  */
  open_actions: function() {
    return this.hasMany(Action, 'group_id', 'group_id').query(function(qb){
      qb.whereNull('deleted_at')
        .where(function(){ 
          this.where(function(){
            this.where('end_at', '>', moment().month(-2).format("YYYY-MM-DD HH:mm:ss"))
            .where('end_at', '<', moment().format("YYYY-MM-DD HH:mm:ss"))
          })
          .orWhere(function(){
            this.where('start_at', '<', moment().format("YYYY-MM-DD HH:mm:ss")).where('end_at', '>', moment().format("YYYY-MM-DD HH:mm:ss"))
          })
          .orWhere(function(){
            this.where('start_at', '<', moment().format("YYYY-MM-DD HH:mm:ss")).whereNull('end_at')
          })});
    });
  },

  initialize: function() {
    this.on("saving", this._assertNameUnique);
    this.on("saving", this._assertCodeUnique);
    
    // if(this.isNew())
    //   this.validations =  {
    //     name: [
    //       { method: 'isRequired', error:'Name Required'},
    //     ],
    //     group_code: [
    //       { method: 'isRequired', error:'Group Code Required'},
    //     ]
    //   };
    // else
    //   this.validations =  {
    //   };
    // this.on('saving', this.validateOnSave);
  },
 
  _assertCodeUnique: function(model, attributes, options) {
    if (this.hasChanged('group_code')) {
      return Group
        .query('where', 'group_code', this.get('group_code'))
        .fetch({})
        .then(function (existing) {
          if (existing) throw new ValidationError('Choose Another Group Code');
        });
    }
  },

  _assertNameUnique: function(model, attributes, options) {
    if (this.hasChanged('name')) {
      return Group
        .query('where', 'name', this.get('name'))
        .fetch({})
        .then(function (existing) {
          if (existing) throw new ValidationError('Choose Another Name');
        });
    }
  },
  //When the group is created, give the creator full access to this group on group_user table
  saveCreator: function(){
    return new GroupUser({
      group_id: this.id,
      user_id: this.get('created_by_user_id'),
      admin_settings: true,
      admin_members: true,
      mod_actions: true,  
      mod_comments: true,
      submit_action: true,
    }).save();
  },

  generateGroupCodeAndSave: function(){
    return Group.findUniqueGroupCode(Group.randomGroupCode())
    .then(group_code=>{
      return this.save({group_code: group_code});
    });
  }
}, {
 
  getGroupWithRelated: function(group_id: number, withRelated: any){
    return this.where({group_id:group_id}).fetch({withRelated:withRelated})
  },
  //Find unique group code
  findUniqueGroupCode: function(randomCode){
    return Group.where({group_code: randomCode})
    .fetch().then(group=>{
      if(group)
        return this.findUniqueGroupCode(Group.ramdomGroupCode());
      return new Promise(function (resolve, reject) {
        resolve(randomCode);
      });
    })
  },



  /**
  * @description Creates a unique group code and returns it
  */
  randomGroupCode: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

});