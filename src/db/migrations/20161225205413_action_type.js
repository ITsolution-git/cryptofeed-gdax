
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_type', (table) => {
    table.increments('action_type_id');
    table.string('type').notNullable();
    table.integer('default_points').notNullable();
    table.string('param1_name');
    table.string('param2_name');
    table.string('param3_name');
    table.string('param4_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type');
};
