
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_settings', (table) => {
    table.increments('group_setting_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();
    table.integer('group_id').notNullable();
    table.boolean('allow_member_action').notNullable().default(0);
    table.integer('member_action_level');
    //table.foreign('group_id').references('group.group_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_settings');
};
