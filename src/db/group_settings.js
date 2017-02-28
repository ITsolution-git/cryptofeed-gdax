
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('group_settings').del()
  .then(() => {
    return Promise.join(
      knex('group_settings').insert({
        group_id: 1,
        allow_member_action: 0,
        member_action_level: 5000
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('group_settings').insert({
        group_id: 2,
        allow_member_action: 1,
        member_action_level: 5000
      })
    );
  });
};
