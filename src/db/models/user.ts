
var bookshelf = require('../connection');

let bcrypt = require('bcryptjs');
import Group from './group';
import GroupUser from './group_user';
import User from './user';


export default bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  idAttribute: 'user_id',
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