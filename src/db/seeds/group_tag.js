
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('group_tag').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('group_tag').insert({group_id: 1, tag: 'tag1'}),
        knex('group_tag').insert({group_id: 1, tag: 'tag2'}),
        knex('group_tag').insert({group_id: 2, tag: 'tag1'}),
        knex('group_tag').insert({group_id: 2, tag: 'tag3'})
      ]);
    });
};
