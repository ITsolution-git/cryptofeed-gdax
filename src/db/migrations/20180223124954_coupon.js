
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('coupon', (table) => {

    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();

    table.increments('coupon_id');
    table.string('code', 80).unique().notNullable();
    table.string('min_purchase').defaultTo();
    table.string('amount').defaultTo('');
    table.string('type').defaultTo('fixed');
    
  });
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('coupon');
};
