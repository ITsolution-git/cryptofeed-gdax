const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('user').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('letmein', salt);
    return Promise.join(
      knex('user').insert({
        user_id: 1,
        email: 'jasonh@actodo.co',
        username: 'jasonh',
        password: hash,
        first_name: 'Jason',
        last_name: 'Holderness',
        avatar_file: 'https://aboutme.imgix.net/background/users/j/a/s/jasonholderness_1437586180_71.jpg',
        bio: 'Jason is the founder of ACTodo. A political junkie, and pursuer of getting shit done.',
        latitude: '39.087943',
        longitude: '-120.035874'
      }),
      knex('user').insert({
        user_id: 2,
        email: 'roy.smith0820@gmail.com',
        username: 'erwin',
        password: hash,
        first_name: 'Erwin',
        last_name: 'Keller',
        avatar_file: 'https://aboutme.imgix.net/background/users/j/a/s/jasonholderness_1437586180_71.jpg',
        bio: 'Javascript developer',
        latitude: '39.087943',
        longitude: '-120.035874'
      }),
      knex('user').insert({
        user_id: 3,
        email: 'sunil@actodo.co',
        username: 'sunil',
        password: hash,
        first_name: 'Sunil',
        last_name: '',
        avatar_file: 'https://aboutme.imgix.net/background/users/j/a/s/jasonholderness_1437586180_71.jpg',
        bio: 'IOS developer',
        latitude: '39.087943',
        longitude: '-120.035874'
      })
    );
  })
  // .then(() => {
  //   const salt = bcrypt.genSaltSync();
  //   const hash = bcrypt.hashSync('password', salt);
  //   return Promise.join(
  //     knex('user').insert({
  //       email: 'seed2@test.net',
  //       username: 'seeder2',
  //       password: hash,
  //       first_name: 'seedie',
  //       last_name: 'two',
  //       avatar_file: 'https://upload.wikimedia.org/wikipedia/en/d/db/Korra_The_Legend_of_Korra.jpg',
  //       bio: 'Seedie two is a great seeder. The second best!',
  //       latitude: '51.5032520',
  //       longitude: '-0.1278990'
  //     })
  //   );
  // });
};
