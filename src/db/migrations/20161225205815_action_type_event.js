
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_type_event', (table) => {
    table.increments('action_type_event_id');
    table.integer('action_id').notNullable();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('updated_at', true).defaultTo(knex.fn.now());
    table.string('event_name').notNullable();
    table.text('event_details');
    table.string('event_url');
    table.string('event_address');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type_event');
};
