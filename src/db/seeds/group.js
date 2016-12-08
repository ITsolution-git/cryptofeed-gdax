exports.seed = (knex, Promise) => {
  return knex('group').del()
  .then(() => {
    return Promise.join(
      knex('group').insert({
        created_by_user_id: 1,
        name: 'Test Group 1',
        description: 'Test Group 1 is awesome!',
        welcome: 'Welcome to Test Group 1',
        latitude: '51.5032520',
        longitude: '-0.1278990',
        private: 0,
        banner_image_url: 'https://theinquisitiveloon.files.wordpress.com/2013/04/avatar-the-last-airbender-the-gang-in-earth-colors.jpg',
        group_code: 'ABCD1234'
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('group').insert({
        created_by_user_id: 1,
        name: 'Test Group 2 Private',
        description: 'Test Group 2 is private!',
        welcome: 'Welcome to Test Group 2 Private',
        latitude: '51.5032520',
        longitude: '-0.1278990',
        private: 1,
        banner_image_url: 'https://content-oars.netdna-ssl.com/wp-content/uploads/2015/12/Yosemite.Fran_.jpg',
        group_code: 'ZYXW0987'
      })
    );
  });
};
