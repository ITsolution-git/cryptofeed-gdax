
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_user', (table) => {
    table.increments('group_user_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();
    table.integer('group_id').notNullable();
    table.integer('user_id').notNullable();
    table.boolean('admin_settings').notNullable().default(0);
    table.boolean('admin_members').notNullable().default(0);
    table.boolean('mod_actions').notNullable().default(0);
    table.boolean('mod_comments').notNullable().default(0);
    table.boolean('submit_action').notNullable().default(0);
    table.boolean('banned').notNullable().default(0);
    table.string('banned_reason');
    //table.foreign('group_id').references('group.group_id');
    //table.foreign('user_id').references('user.user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_user');
};
