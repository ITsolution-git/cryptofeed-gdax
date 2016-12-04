const bcrypt = require('bcryptjs');
const knex = require('../db/connection');

/**
* Inserts user data into database
*/
function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  return knex('user')
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
}

function getUserByUsername(username) {
  return knex('user').where({username}).first();
}

function getUserByEmail(email) {
  return knex('user').where({email}).first();
}

function comparePass(userPassword, databasePassword) {
  const bool = bcrypt.compareSync(userPassword, databasePassword);
  if (!bool) throw new Error('invalid password');
  else return true;
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
  comparePass
};
