
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action', (table) => {
    table.increments('action_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();
    table.integer('group_id').notNullable();
    table.integer('created_by_user_id').notNullable();
    table.integer('action_type_id').notNullable();
    table.string('title').notNullable();
    table.string('subtitle').notNullable();
    table.text('description');
    table.text('thanks_msg');
    table.integer('points');
    table.dateTime('start_at');
    table.dateTime('end_at');
    table.dateTime('deleted_at');
    table.integer('deleted_by_user_id');
    table.text('param1');
    table.text('param2');
    table.text('param3');
    table.text('param4');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action');
};
