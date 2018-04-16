exports.up = (knex, Promise) => {

  return knex.schema.createTable('quotelog', (table) => {
    table.increments('priceid');

    table.string('symbol', 20).notNullable();
    table.decimal('bid', 10, 4).defaultTo(0.0000);
    table.decimal('last', 10, 4).defaultTo(0.0000);
    table.decimal('ask', 10, 4).defaultTo(0.0000);
    table.decimal('change', 10, 4).defaultTo(0.0000);
    table.decimal('high', 10, 4).defaultTo(0.0000);
    table.decimal('low', 10, 4).defaultTo(0.0000);
    table.decimal('open', 10, 4).defaultTo(0.0000);
    table.decimal('prev_close', 10, 4).defaultTo(0.0000);

    table.dateTime('time');
    table.bigInteger('timestamp');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('quotelog');
};
