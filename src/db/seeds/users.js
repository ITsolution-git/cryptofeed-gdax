const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('users').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('test123', salt);
    return Promise.join(
      knex('users').insert({
        email: 'jeremy@test.net',
        username: 'jeremyt',
        password: hash,
        first_name: 'jeremy',
        last_name: 'test',
        avatar_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
        bio: 'Jeremy is a great tester. The best!',
        latitude: '51.5032520',
        longitude: '-0.1278990'
      })
    );
  });
};
