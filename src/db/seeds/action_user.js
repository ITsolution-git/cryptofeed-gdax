
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action_user').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action_user').insert({action_user_id:1, action_id: 1, user_id: 1, points: 5}),
        knex('action_user').insert({action_user_id:2, action_id: 2, user_id: 1, points: 5, skip:true})
      ]);
    });
};
