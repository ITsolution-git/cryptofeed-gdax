exports.up = (knex, Promise) => {

  return knex.schema.createTable('user', (table) => {
    table.increments('user_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();
    table.string('email').unique().notNullable();
    table.string('username').unique();
    table.string('password').notNullable('');
    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');
    table.string('avatar_file').defaultTo('');
    table.text('bio').defaultTo('');
    table.decimal('latitude',9,6).defaultTo(0);
    table.decimal('longitude',9,6).defaultTo(0);
    table.string('facebook').nullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('user');
};
