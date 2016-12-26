
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_type_email', (table) => {
    table.increments('action_type_email_id');
    table.integer('action_id').notNullable();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('updated_at', true).defaultTo(knex.fn.now());
    table.string('to_email').notNullable();
    table.string('subject');
    table.text('body');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type_email');
};
