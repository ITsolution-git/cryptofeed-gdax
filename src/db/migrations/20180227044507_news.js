
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('news', (table) => {
    table.dateTime('updated_at', true).defaultTo();

    table.increments('news_id');

    table.string('heading').defaultTo('');
    table.integer('author_id').notNullable();
    table.text('picture').defaultTo('');
    table.text('content').defaultTo('');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('news');
};
