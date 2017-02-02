
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_user', (table) => {
    table.increments('action_user_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo(knex.fn.now());
    table.integer('action_id').notNullable();
    table.integer('user_id').notNullable();
    table.integer('points');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_user');
};
