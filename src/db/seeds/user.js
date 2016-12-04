const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('user').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('password', salt);
    return Promise.join(
      knex('user').insert({
        email: 'seed1@test.net',
        username: 'seeder1',
        password: hash,
        first_name: 'seed',
        last_name: 'one',
        avatar_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
        bio: 'Seed is a great tester. The best!',
        latitude: '51.5032520',
        longitude: '-0.1278990'
      })
    );
  });
};
