
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action').insert({
            action_id: 1,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Group 1 Action 1 email',
            action_type_id: 1,
            description: 'Group 1 Action 1 Description'
        }),
        knex('action').insert({
            action_id: 2,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Group 1 Action 2 call',
            action_type_id: 2,
            description: 'Group 1 Action 2 Description'
        }),
      ]);
    });
};
