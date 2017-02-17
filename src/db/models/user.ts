
import bookshelf from '../connection';
import  _ from 'lodash';
const bcrypt = require('bcryptjs');

import bluebird from 'bluebird';
import Group from './group';
import GroupUser from './group_user';
import User from './user';

export default bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  idAttribute: 'user_id',

  initialize: function() {
    this.on("saving", this.assertUnique("email"));
    this.on("saving", this.assertUnique("username"));
  },

  validations: {
    email: [
      'isRequired',
      { isEmail: {allow_display_name: true} }, // Options object passed to node-validator
      { method: 'isLength', error: 'Username 4-32 characters long.', args: [4, 32] } // Custom error message
    ],
    username: 'isRequired',
    firstname: 'isRequired',
    lastname: 'isRequired',
  },
  assertUnique :function () {
    const columns = _.toArray(arguments)
    if (columns.length === 0) {
      throw new Error("please pass unique columns")
    }
    return function(model, attributes, options) {
      const hasChanged = _.some(columns, column => {
        return model.hasChanged(column)
      })
      if (model.isNew() || hasChanged) {
        return this.constructor.query(q => {
          columns.forEach(column => {
            q.where(column, '=', model.get(column))
          })
          if (!model.isNew()) {
            q.where(model.idAttribute, '<>', model.id)
          }
        })
        .count({ transacting: options.transacting })
        .then(n => {
          if (n > 0) {
            return bluebird.reject({
              name: "DuplicateError",
              message: columns.join(", ")
            })
          }
        })
      }
    }
  },
  groups: function() {
    return this.belongsToMany(Group, 'group_user', 'user_id', 'group_id', 'user_id', 'group_id');
  },
  
  authenticate: function(password){
    const bool = bcrypt.compareSync(password, this.get('password'));
    if (!bool) throw new Error('invalid password');
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
  createUser: function(attrs){
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(attrs.password, salt);

    //TODO: Validate the email & username don't exist in the system
    var user = new User({
      email: attrs.email,
      username: attrs.username,
      password: hash,
      first_name: attrs.first_name,
      last_name: attrs.last_name,
      // avatar_url: attrs.avatar_url,
      // bio: attrs.bio,
      // latitude: attrs.latitude,
      // longitude: attrs.longitude
    }).save(); 
    return user;  
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