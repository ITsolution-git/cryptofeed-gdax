
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('customer', (table) => {

    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();

    table.increments('customer_id');
    table.string('membership_number', 80);
    table.string('title').defaultTo('');
    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');
    table.string('organization').defaultTo('');
    table.dateTime('birth_date');
    table.string('address').defaultTo('{}');
    table.string('phone_home').defaultTo('');
    table.string('phone_moblie').defaultTo('');
    table.string('email').defaultTo('');
    table.string('prefered_contact_method').defaultTo('');
    
  });
};

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable('customer');
};
