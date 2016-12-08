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
        bio: 'Seed One is a great seeder. The best!',
        latitude: '51.5032520',
        longitude: '-0.1278990'
      })
    );
  })
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('password', salt);
    return Promise.join(
      knex('user').insert({
        email: 'seed2@test.net',
        username: 'seeder2',
        password: hash,
        first_name: 'seedie',
        last_name: 'two',
        avatar_url: 'https://upload.wikimedia.org/wikipedia/en/d/db/Korra_The_Legend_of_Korra.jpg',
        bio: 'Seedie two is a great seeder. The second best!',
        latitude: '51.5032520',
        longitude: '-0.1278990'
      })
    );
  });
};
