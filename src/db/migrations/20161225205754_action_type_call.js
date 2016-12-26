
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_type_call', (table) => {
    table.increments('action_type_call_id');
    table.integer('action_id').notNullable();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('updated_at', true).defaultTo(knex.fn.now());
    table.string('phone_number').notNullable();
    table.text('talking_points');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type_call');
};
