const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('user').del()
  .then(() => {
    // const salt = bcrypt.genSaltSync();
    // const hash = bcrypt.hashSync('letmein', salt);
    // return Promise.join(
    //   knex('user').insert({
    //     user_id: 1,
    //     email: 'jasonh@actodo.co',
    //     username: 'jasonh',
    //     password: hash,
    //     first_name: 'Jason',
    //     last_name: 'Holderness',
    //   })
    // );
  })
};
