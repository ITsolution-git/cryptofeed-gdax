
exports.up = function(knex, Promise) {
  return knex.schema.createTable('action_type_survey', (table) => {
    table.increments('action_type_survey_id');
    table.integer('action_id').notNullable();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('updated_at', true).defaultTo(knex.fn.now());
    table.string('survey_url').notNullable();
    table.text('about_survey');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type_survey');
};
