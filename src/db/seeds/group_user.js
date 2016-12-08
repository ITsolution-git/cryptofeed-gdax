
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('group_user').del()
  .then(() => {
    return Promise.join(
      knex('group_user').insert({
        group_id: 1,
        user_id: 1,
        admin_settings: 1,
        admin_members: 1,
        mod_actions: 1,
        mod_comments: 1,
        submit_action: 1
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('group_user').insert({
        group_id: 1,
        user_id: 2
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('group_user').insert({
        group_id: 2,
        user_id: 1,
        admin_settings: 1,
        admin_members: 1,
        mod_actions: 1,
        mod_comments: 1,
        submit_action: 1
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('group_user').insert({
        group_id: 2,
        user_id: 2,
        submit_action: 1
      })
    );
  });
};
