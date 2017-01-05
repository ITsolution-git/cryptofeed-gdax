
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action_user').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action_user').insert({action_id: 2, user_id: 2, points: 123})
      ]);
    });
};
