
import bookshelf from '../bookshelf';
var _ = require('lodash');
const bcrypt = require('bcryptjs');

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
import bluebird from 'bluebird';
import Group from './group';
import GroupUser from './group_user';
import User from './user';
import Action from './action';
import ActionUser from './action_user';

export default bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  idAttribute: 'user_id',

  initialize: function() {
    this.on("saving", this._assertEmailUnique);
    this.on("saving", this._assertUsernameUnique);
    // if(this.isNew())
    //   this.validations =  {
    //     email: [
    //       { method: 'isRequired', error:'Email Required'},
    //       { isEmail: {allow_display_name: true} }, // Options object passed to node-validator
    //       // { method: 'isLength', error: 'Username 4-32 characters long.', args: [4, 32] } // Custom error message
    //     ],
    //     password: [
    //       { method: 'isRequired', error:'Password Required'},
    //       { method: 'isLength', error: 'Password shoud be longer than 6.', args: [6] }, // Custom error message
    //     ]
    //   };
    // else
    //   this.validations =  {
    //     email: [
    //       { isEmail: {allow_display_name: true} }, // Options object passed to node-validator
    //       // { method: 'isLength', error: 'Username 4-32 characters long.', args: [4, 32] } // Custom error message
    //     ],
    //     password: { method: 'isLength', error: 'Password shoud be longer than 6.', args: [6] }, // Custom error message
        
    //   };
    // this.on('saving', this.validateOnSave);
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
          if (existing) throw new ValidationError('Choose Another Email');
        });
    }
  },
  _assertUsernameUnique: function(model, attributes, options) {
    if (this.hasChanged('username')) {
      return User
        .query('where', 'username', this.get('username'))
        .fetch({})
        .then(function (existing) {
          if (existing) throw new ValidationError('Choose Another Username');
        });
    }
  },
  groups: function() {
    return this.belongsToMany(Group, 'group_user', 'user_id', 'group_id', 'user_id', 'group_id');
  },
  actions: function() {
    return this.belongsToMany(Action, 'action_user', 'user_id', 'action_id', 'user_id', 'action_id');
  },
  
  authenticate: function(password){
    const bool = bcrypt.compareSync(password, this.get('password'));
    if (!bool) throw new Error('Invalid password');
    else return true;
  },
  // initialize: function() {
    // this.on('saving', this.validateSave);
  // },
  // validateSave: function() {
    // return checkit(rules).run(this.attributes);
  // },

  /* returns ID array of groups this user belongs to */
  getGroupIDs: function(){

     return this.load('groups')
      .then(user=>{
        return user.related('groups').toJSON().map((group)=>{return group.group_id});
      })
  },
  getTotalPointsOn: function(group){  
    let actionIDs = [];
    return group.load('actions').then(gro=>{
      return actionIDs = gro.related('actions').toJSON().map((action)=>{return action.action_id});
    }).then(actionIDs=>{
      let _this = this;
      return ActionUser.collection().query(function(qb) {
        qb.where('user_id', '=', _this.get('user_id')).whereIn('action_id', actionIDs);
      }).fetch();
    }).then(actionusers=>{
      let points = 0;
      actionusers.forEach(actionuser=>{
        points += actionuser.get('points');
      });
      return points;      
    });
  },
  getGroupUser: function(group_id){
    return GroupUser.where({user_id: this.get('user_id'), group_id: group_id}).fetch();
  },
  //add group1, 2 to this user ; this is the case when user registers and add default group
  addDefaultGroup: function(){
    return new GroupUser({user_id: this.get('user_id'), group_id: 1}).save()
    .then(groupuser => {
      if(groupuser)
        return new GroupUser({user_id: this.get('user_id'), group_id: 2}).save();
      else
        throw new Error('Adding user to default group failed');
    })
    .then(groupuser =>{
      if(groupuser)
        return groupuser;
      else
        throw new Error('Adding user to default group failed');
    })
  }
}, {
  // saveUser: function(attrs){
  //   if(attrs.password){

  //   }

  // },

  // byIdWithUserGroup: function (userId) {
  //     return this.forge()
  //         .query({ where: { id: userId } })
  //         .fetch({ withRelated: ['userGroup'] })
  //     ;
  // }
  
  login: function(email, password) {
    if (!email || !password) throw new Error('Email and password are both required');
    return new this({email: email.toLowerCase().trim()}).fetch({require: true})
    .tap(function(customer) {
      return bcrypt.compareAsync(password, customer.get('password'))
        .then(function(res) {
          if (!res) throw new Error('Invalid password');
        });
    });
  },
  findUniqueUsername: function(base, number){
    return User.where({username:base+number})
    .fetch().then(user=>{
      if(user)
        return this.findUniqueUsername(base, number+1);
      return new Promise(function (resolve, reject) {
        resolve(base+number);
      });
    })
  },
  //newUser.email is a must and username is optional
  generateUsernameFromEmail: function(newUser){
    //If username already exist from request, returns it
    if(newUser.username)
        return new Promise(function (resolve, reject) {
          resolve(newUser.username);
        });
    else{
      let emailname = newUser.email.slice(0, newUser.email.indexOf('@'));

      return User.where({username:emailname})
      .fetch().then(user=>{
        if(user)
          return this.findUniqueUsername(emailname, 1);
    
        else
          return new Promise(function (resolve, reject) {
            resolve(emailname);
          });
      });
    }
  }
});