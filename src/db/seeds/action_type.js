
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action_type').insert({action_type_id: 1, type: 'email', default_points: 100, param1_name: 'To Email', param2_name: 'Subject', param3_name: 'Body'}),
        knex('action_type').insert({action_type_id: 2, type: 'call', default_points: 100, param1_name: 'Phone Number', param2_name: 'Talking Points'}),
        knex('action_type').insert({action_type_id: 3, type: 'share', default_points: 100, param1_name: 'Share URL', param2_name: 'Long Text', param3_name: 'Short Text'}),
        knex('action_type').insert({action_type_id: 4, type: 'contact', default_points: 100, param1_name: 'Contact URL', param2_name: 'Talking Points'}),
        knex('action_type').insert({action_type_id: 5, type: 'survey', default_points: 100, param1_name: 'Survey URL', param2_name: 'About Survey'}),
        knex('action_type').insert({action_type_id: 6, type: 'event', default_points: 100, param1_name: 'Event Name', param2_name: 'Event Details', param3_name: 'Event URL', param4_name: 'Event Address'})

      ]);
    });
};
