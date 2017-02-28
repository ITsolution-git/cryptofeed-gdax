
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action').insert({
            group_id: 1,
            created_by_user_id: 1,
            title: 'Welcome to ACTodo',
            subtitle: 'This is your first act. Tap here to view the details.',
            action_type_id: 1,
            description: `
                  Nice work! You’re viewing the details of the act to do. Had this been an actual act, this is where the who, what, where, why and how of the action would live.

                  To do this action, tap the “Do Action” button at the bottom of the screen.
                  `,
            points: 200,
            param1: `Awesome!

                  Had this been an actual act, this screen would show you details, such as talking points, or example statements, to help you quickly complete the action.

                  Tap the “Complete Action” button below to complete the action.`,
            thanks_msg: `Congrats! You just completed this action!

                  Easy, right?

                  Let’s head back to the dashboard to see what other acts you can do.`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            group_id: 1,
            created_by_user_id: 1,
            title: 'Skip this action',
            subtitle: 'Swipe left to reveal the skip button. Then tap it.',
            action_type_id: 1,
            description: `
                  Oops. Looks like you tapped the action, rather than swiped it.

                  No worries. Just tap the “Skip” button in the header instead.

                  Or if you just want to ignore these instructions completely, go ahead and tap the button to do this action.
                  `,
            points: 1,
            param1: `
                  Well, instead of skipping it, you’re doing it. That’s cool. You go, Glen Coco!`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        
      ]);
    });
};
