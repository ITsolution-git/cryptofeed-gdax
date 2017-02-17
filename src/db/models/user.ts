
import bookshelf from '../connection';
var _ = require('lodash');
const bcrypt = require('bcryptjs');

const ValidationError = require('bookshelf-validate/lib/errors').ValidationError;
import bluebird from 'bluebird';
import Group from './group';
import GroupUser from './group_user';
import User from './user';

export default bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  idAttribute: 'user_id',

  initialize: function() {
    this.on("saving", this._assertEmailUnique);
    this.on("saving", this._assertUsernameUnique);
    if(this.isNew())
      this.on('saving', this.validateOnSave);
    this.on('saving', this.cryptPassword);
  },

  validations: {
    email: [
      { method: 'isRequired', error:'Email Required'},
      { isEmail: {allow_display_name: true} }, // Options object passed to node-validator
      // { method: 'isLength', error: 'Username 4-32 characters long.', args: [4, 32] } // Custom error message
    ],
    password: { method: 'isLength', error: 'Password shoud be longer than 6.', args: [6] }, // Custom error message
    
    username: { method: 'isRequired', error:'Username Required'},
    first_name: { method: 'isRequired', error:'First Name Required'},
    last_name: { method: 'isRequired', error:'Last Name Required'},
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

}, {
  saveUser: function(attrs){
    if(attrs.password){

    }

  },
  login: function(email, password) {
    if (!email || !password) throw new Error('Email and password are both required');
    return new this({email: email.toLowerCase().trim()}).fetch({require: true})
    .tap(function(customer) {
      return bcrypt.compareAsync(password, customer.get('password'))
        .then(function(res) {
          if (!res) throw new Error('Invalid password');
        });
    });
  }
});