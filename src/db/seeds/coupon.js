const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('user').del()
  .then(() => {
    return Promise.all([
      knex('coupon').insert({
        coupon_id: 1,
        code: 'TESTFIXED50',
        min_purchase: '500',
        amount: "50",
        type: 'fixed',
      }),
      knex('coupon').insert({
        coupon_id: 2,
        code: 'TESTPERCENTD10',
        min_purchase: '1000',
        amount: "10",
        type: 'percent',
      })
    ]);
  })
};
