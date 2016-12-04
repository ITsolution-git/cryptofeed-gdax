const bcrypt = require('bcryptjs');
const knex = require('../db/connection');
var util = require('util');

function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  var rtn = knex('user')
  .insert({
    email: req.body.email,
    username: req.body.username,
    password: hash,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    avatar_url: req.body.avatar_url,
    bio: req.body.bio,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  })
  .returning('*');

  return rtn;
}

module.exports = {
  createUser
};
