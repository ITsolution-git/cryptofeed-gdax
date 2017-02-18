
exports.up = function(knex, Promise) {
//   return Promise.all([
//   knex.schema.createTable('action_type', (table) => {
//     table.increments('action_type_id');
//     table.string('type').notNullable();
//     table.integer('default_points').notNullable();
//     table.string('param1_name');
//     table.string('param2_name');
//     table.string('param3_name');
//     table.string('param4_name');
//   }),
//   knex('action_type').insert({action_type_id: 1, type: 'email', default_points: 100, param1_name: 'To Email', param2_name: 'Subject', param3_name: 'Body'}),
//   knex('action_type').insert({action_type_id: 2, type: 'call', default_points: 100, param1_name: 'Phone Number', param2_name: 'Talking Points'}),
//   knex('action_type').insert({action_type_id: 3, type: 'share', default_points: 100, param1_name: 'Share URL', param2_name: 'Long Text', param3_name: 'Short Text'}),
//   knex('action_type').insert({action_type_id: 4, type: 'contact', default_points: 100, param1_name: 'Contact URL', param2_name: 'Talking Points'}),
//   knex('action_type').insert({action_type_id: 5, type: 'survey', default_points: 100, param1_name: 'Survey URL', param2_name: 'About Survey'}),
//   knex('action_type').insert({action_type_id: 6, type: 'event', default_points: 100, param1_name: 'Event Name', param2_name: 'Event Details', param3_name: 'Event URL', param4_name: 'Event Address'})
// ]);
  return knex.schema.createTable('action_type', (table) => {
    table.increments('action_type_id');
    table.string('type').notNullable();
    table.integer('default_points').notNullable();
    table.string('param1_name');
    table.string('param2_name');
    table.string('param3_name');
    table.string('param4_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('action_type');
};
