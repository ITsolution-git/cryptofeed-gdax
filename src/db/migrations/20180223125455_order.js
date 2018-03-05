
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('order', (table) => {

    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.timestamp('paid_on', true);
    table.dateTime('updated_at', true).defaultTo();

    table.increments('order_id');
    table.integer('coupon_id');
    table.integer('customer_id');

    table.string('message').defaultTo('');
    table.string('card_type').defaultTo('');

    table.string('currency').defaultTo('');

    table.integer('amount');
    table.string('card_amount').defaultTo('');
    table.string('btc_amount').defaultTo('');

    table.string('discount').defaultTo(0);

    table.string('exchange_rate').defaultTo('');

    table.string('address').defaultTo('');
    table.string('WIF').defaultTo('');

    
    table.string('callback_url').defaultTo('');
    table.string('transaction_hash').defaultTo('{}');
    table.string('shipping_number').defaultTo('');
    
    table.string('status').defaultTo('');

    table.text('transaction').defaultTo('{}');
    table.text('broadcast_result').defaultTo('{}');
    
    
    
  });
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('order');
};
