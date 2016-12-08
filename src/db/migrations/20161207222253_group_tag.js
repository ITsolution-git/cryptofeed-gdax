
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_tag', (table) => {
    table.increments('group_tag_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('updated_at', true).defaultTo(knex.fn.now());
    table.integer('group_id').notNullable();
    table.string('tag').notNullable();
    table.unique(['group_id', 'tag']);
    //table.foreign('group_id').references('group.group_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_tag');
};
