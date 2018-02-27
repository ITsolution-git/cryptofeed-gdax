exports.up = (knex, Promise) => {

  return knex.schema.createTable('user', (table) => {
    table.increments('user_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();
    table.string('email', 80).unique().notNullable();
    table.string('password').defaultTo();
    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');

    table.string('role').defaultTo('customer');
    table.string('customer_id').defaultTo('');
    
    table.string('reset_password_token').nullable();
    table.dateTime('reset_password_expires', true).defaultTo();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('user');
};
