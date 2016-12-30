
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action_type_email').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action_type_email').insert({action_type_email_id: 1, action_id: 1, to_email: 'test@test.net', subject: 'Cheese', body: 'Say you like cheese.'}),
      ]);
    });
};
