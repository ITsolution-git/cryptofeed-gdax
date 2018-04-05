
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('bittrex_trades', (table) => {
    table.increments('bittrex_trade_id');

    table.text('Id').defaultTo();
    table.dateTime('TimeStamp').defaultTo();
    table.text('Quantity').defaultTo('');
    table.text('Price').defaultTo('');
    table.text('Total').defaultTo('');
    table.text('FillType').defaultTo('');
    table.text('OrderType').defaultTo('');
    table.text('market').defaultTo('');
    
    table.dateTime('updated_at', true).defaultTo();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());

  })
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('bittrex_trades');
};
