
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('trades', (table) => {
    table.increments('trade_id');

    table.dateTime('date').defaultTo();
    table.text('amount').defaultTo('');
    table.text('type').defaultTo('');
    table.text('total').defaultTo('');
    table.text('price').defaultTo('');
    table.text('orderHash').defaultTo('');
    table.text('uuid').defaultTo('');
    table.text('buyerFee').defaultTo('');
    table.text('sellerFee').defaultTo('');
    table.text('gasFee').defaultTo('');
    table.text('timestamp').defaultTo('');
    table.text('maker').defaultTo('');
    table.text('taker').defaultTo('');
    table.text('market').defaultTo('');
    
    table.text('transactionHash').defaultTo('');

    table.dateTime('updated_at', true).defaultTo();
    table.timestamp('created_at', true).defaultTo(knex.fn.now());

  })
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('trades');
};
