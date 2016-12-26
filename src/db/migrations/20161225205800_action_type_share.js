
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_type_share', (table) => {
    table.increments('action_type_share_id');
    table.integer('action_id').notNullable();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('updated_at', true).defaultTo(knex.fn.now());
    table.string('share_url').notNullable();
    table.text('post_text_long');
    table.text('post_text_short');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type_share');
};
