
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('action').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('action').insert({
            action_id: 1,
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
            action_id: 2,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Skip this action',
            subtitle: 'Swipe left to reveal the skip button. Then tap it.',
            action_type_id: 2,
            description: `
                  Oops. Looks like you tapped the action, rather than swiped it.

                  No worries. Just tap the “Skip” button in the header instead.

                  Or if you just want to ignore these instructions completely, go ahead and tap the button to do this action.
                  `,
            points: 100,
            param1: `
                  Well, instead of skipping it, you’re doing it. That’s cool. You go, Glen Coco!`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            action_id: 3,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Mail to me',
            subtitle: 'Select sender mail address and mail content',
            action_type_id: 3,
            description: `
                  Some description on email action
                  `,
            points: 25,
            param1: `
                  sunil@actodo.co`,
            param2: `Subject of mail`,
            param3: `Can you please complete the phone action
                     After completing please let me know
                     Thanks`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),

        knex('action').insert({
            action_id: 4,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Share with us',
            subtitle: 'Select url and share it with us',
            action_type_id: 4,
            description: `
                  Some description on share action
                  `,
            points: 1,
            param1: `
                  http://share.url/link/to/share/data`,
            param2: `Long Description`,
            param3: `Short Description`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            action_id: 5,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Contact action',
            subtitle: 'Contact me',
            action_type_id: 5,
            description: `
                  Description on contact action
                  `,
            points: 200,
            param1: `
                  url to contact`,
            param2: `talking point`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            action_id: 6,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Survey',
            subtitle: 'Survey action',
            action_type_id: 6,
            description: `
                   Description on survey action
                  `,
            points: 50,
            param1: `
                  url to survey`,
            param2: `Some note about survey`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            action_id: 7,
            group_id: 1,
            created_by_user_id: 1,
            title: 'Event action',
            subtitle: 'Subtitle of event action',
            action_type_id: 7,
            description: `
                  Descriptions on event action
                  `,
            points: 500,
            param1: `
                  Eventname`,
            param2: `
                  Eventdetails`,
            param3: `
                  Eventurl`,
            param4: `
                  Eventaddresss`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            action_id: 8,
            group_id: 2,
            created_by_user_id: 2,
            title: 'Skip this action',
            subtitle: 'Swipe left to reveal the skip button. Then tap it.',
            action_type_id: 2,
            description: `
                  Oops. Looks like you tapped the action, rather than swiped it.

                  No worries. Just tap the “Skip” button in the header instead.

                  Or if you just want to ignore these instructions completely, go ahead and tap the button to do this action.
                  `,
            points: 12,
            param1: `
                  Well, instead of skipping it, you’re doing it. That’s cool. You go, Glen Coco!`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
        knex('action').insert({
            action_id: 9,
            group_id: 2,
            created_by_user_id: 2,
            title: 'Skip this action',
            subtitle: 'Swipe left to reveal the skip button. Then tap it.',
            action_type_id: 3,
            description: `
                  Oops. Looks like you tapped the action, rather than swiped it.

                  No worries. Just tap the “Skip” button in the header instead.

                  Or if you just want to ignore these instructions completely, go ahead and tap the button to do this action.
                  `,
            points: 132,
            param1: `
                  Well, instead of skipping it, you’re doing it. That’s cool. You go, Glen Coco!`,
            thanks_msg: `Thanks for completing this act.

                  Let’s head back to the dashboard for more!`,
            start_at: new Date(2017, 1, 1) 
        }),
      ]);
    });
};
