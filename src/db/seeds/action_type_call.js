
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action_type_call').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action_type_call').insert({action_type_call_id: 1, action_id: 2, phone_number: '8773456789', talking_points: 'Say you like cheese.'}),
      ]);
    });
};
