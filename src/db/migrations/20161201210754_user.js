exports.up = (knex, Promise) => {
  return knex.schema.createTable('user', (table) => {
    table.increments('user_id');
    table.timestamp('created_at', true).defaultTo(knex.fn.now());
    table.dateTime('updated_at', true).defaultTo();
    table.string('email').notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.string('avatar_url');
    table.text('bio');
    table.decimal('latitude',9,6);
    table.decimal('longitude',9,6);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('user');
};
