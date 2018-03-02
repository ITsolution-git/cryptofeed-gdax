
import bookshelf from '../bookshelf';
var _ = require('lodash');
const bcrypt = require('bcryptjs');

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
import bluebird from 'bluebird';
import User from './user';

export default bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  idAttribute: 'user_id',

  initialize: function() {
    this.on("saving", this._assertEmailUnique);
    this.on('saving', this.cryptPassword);
  },

  cryptPassword: function(model, attributes, options) {
    if (this.hasChanged('password')) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(this.get('password'), salt);

      this.set({password:hash});
      return this;
    }
  },

  _assertEmailUnique: function(model, attributes, options) {
    if (this.hasChanged('email')) {
      return User
        .query('where', 'email', this.get('email'))
        .fetch({})
        .then(function (existing) {
          if (existing) throw new ValidationError('User Email Duplicated. Choose Another Email');
        });
    }
  },

  
  // groups: function() {
  //   return this.belongsToMany(Group, 'group_user', 'user_id', 'group_id', 'user_id', 'group_id').query(function(qb){
  //     qb.whereNull('deleted_at');
  //     // qb.whereNot('group.  ac', 1);    Just uncomment when group is to delete id 1
  //   });
  // },

  // actions: function() {
  //   return this.belongsToMany(Action, 'action_user', 'user_id', 'action_id', 'user_id', 'action_id');
  // },
  // //Seems not working because bookshelf doesn't support to get 
  // //middle db field in m:n relationship
  // group_user: function() {
  //   return this.belongToMany(GroupUser, 'group_user', 'user_id', 'group_id', 'user_id', 'group_id');
  // },

  authenticate: function(password){
    const bool = bcrypt.compareSync(password, this.get('password'));
    if (!bool) throw new Error('Invalid password');
    else return true;
  },

  // getGroupIDs: function(){

  //    return this.load('groups')
  //     .then(user=>{
  //       return user.related('groups').toJSON().map((group)=>{return group.group_id});
  //     })
  // },
  // getTotalPointsOn: function(group){  
  //   let actionIDs = [];
  //   return group.load('actions').then(gro=>{
  //     return actionIDs = gro.related('actions').toJSON().map((action)=>{return action.action_id});
  //   }).then(actionIDs=>{
  //     let _this = this;
  //     return ActionUser.collection().query(function(qb) {
  //       qb.where('user_id', '=', _this.get('user_id')).whereIn('action_id', actionIDs);
  //     }).fetch();
  //   }).then(actionusers=>{
  //     let points = 0;
  //     actionusers.forEach(actionuser=>{
  //       points += actionuser.get('points');
  //     });
  //     return points;      
  //   });
  // },
  // getGroupUser: function(group_id){
  //   return GroupUser.where({user_id: this.get('user_id'), group_id: group_id}).fetch();
  // },
  // //add group1, 2 to this user ; this is the case when user registers and add default group
  // addDefaultGroup: function(){
  //   return new GroupUser({user_id: this.get('user_id'), group_id: 1}).save()
  //   .then(groupuser => {
  //     if(groupuser)
  //       return new GroupUser({user_id: this.get('user_id'), group_id: 2}).save();
  //     else
  //       throw new Error('Adding user to default group failed');
  //   })
  //   .then(groupuser =>{
  //     if(groupuser)
  //       return groupuser;
  //     else
  //       throw new Error('Adding user to default group failed');
  //   })
  // },

  // /** Return true or false accroding to whether user had admin_setting on group or not
  //  * @param group_id
  //  * @return true or false
  // */
  // isGroupAdminSetting: function(group_id){
  //   return GroupUser.where({user_id: this.id, group_id: group_id}).fetch({})
  //   .then((group_user)=>{
  //     if(group_user && group_user.get('admin_settings'))
  //       return true;
  //     else
  //       return false;
  //   });
  // },


  // /** Return true or false accroding to whether user had admin_setting on group or not
  //  * @param group_id
  //  * @return true or false
  // */
  // isGroupAdminMember: function(group_id){
  //   return GroupUser.where({user_id: this.id, group_id: group_id}).fetch({})
  //   .then((group_user)=>{
  //     if(group_user && group_user.get('admin_members'))
  //       return true;
  //     else
  //       return false;
  //   });
  // },

  // /** Creat new group_user record with default value to add user to a group
  //  * @param group_id
  //  * @return group_user
  // */
  // joinGroup: function(group_id){
  //   return new GroupUser({group_id: group_id, user_id: this.id}).save();
  // }
}, {

  // Remove critial information from user
  getSafeUserFromJS: function(user){
    delete user['password'];
    return user;
  }
});