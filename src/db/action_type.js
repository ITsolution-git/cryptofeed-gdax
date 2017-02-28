
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
          
        knex('action_type').insert({action_type_id: 1, type: 'General', default_points: 50, param1_name: 'Action Details', param2_name: '', param3_name: ''}),
        knex('action_type').insert({action_type_id: 2, type: 'Call', default_points: 250, param1_name: 'Phone Number', param2_name: 'Talking Points'}),
        knex('action_type').insert({action_type_id: 3, type: 'Email', default_points: 100, param1_name: 'To Email', param2_name: 'Subject', param3_name: 'Body'}),
        knex('action_type').insert({action_type_id: 4, type: 'Share', default_points: 25, param1_name: 'Share URL', param2_name: 'Long Text', param3_name: 'Short Text'}),
        knex('action_type').insert({action_type_id: 5, type: 'Contact', default_points: 200, param1_name: 'Contact URL', param2_name: 'Talking Points'}),
        knex('action_type').insert({action_type_id: 6, type: 'Survey', default_points: 50, param1_name: 'Survey URL', param2_name: 'About Survey'}),
        knex('action_type').insert({action_type_id: 7, type: 'Event', default_points: 500, param1_name: 'Event Name', param2_name: 'Event Details', param3_name: 'Event URL', param4_name: 'Event Address'})

      ]);
    });
};
