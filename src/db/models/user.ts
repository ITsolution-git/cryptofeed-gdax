
var bookshelf = require('../connection');

const bcrypt = require('bcryptjs');
const tokenHelper = require('../../tools/tokens');

var User = bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  idAttribute: 'user_id',

  
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
      avatar_url: attrs.avatar_url,
      bio: attrs.bio,
      latitude: attrs.latitude,
      longitude: attrs.longitude
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

module.exports = User;  