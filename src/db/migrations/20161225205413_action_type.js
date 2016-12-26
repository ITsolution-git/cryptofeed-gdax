
exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.createTable('action_type', (table) => {
    table.increments('action_type_id');
    table.string('type').notNullable();
    table.integer('default_points').notNullable();
    table.string('table_name').notNullable();
  }),
  knex('action_type').insert({action_type_id: 1, type: 'email', default_points: 100, table_name: 'action_type_email'}),
  knex('action_type').insert({action_type_id: 2, type: 'call', default_points: 100, table_name: 'action_type_call'}),
  knex('action_type').insert({action_type_id: 3, type: 'share', default_points: 100, table_name: 'action_type_share'}),
  knex('action_type').insert({action_type_id: 4, type: 'contact', default_points: 100, table_name: 'action_type_contact'}),
  knex('action_type').insert({action_type_id: 5, type: 'survey', default_points: 100, table_name: 'action_type_survey'}),
  knex('action_type').insert({action_type_id: 6, type: 'event', default_points: 100, table_name: 'action_type_event'})
]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type');
};
