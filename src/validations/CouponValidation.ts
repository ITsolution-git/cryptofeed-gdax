const Joi = require('joi');

export default {
  
  postCoupon: {
    body: Joi.object({
      code: Joi.string().required(),
      min_purchase: Joi.number().integer().required(),
      amount: Joi.number().integer().required(),
      type: Joi.string().required(),
    }).unknown(false)
  },

  validateCoupon: {
    body: Joi.object({
      code: Joi.string().required(),
    }).unknown(false)
  },
  // // POST auth/login
  // login: {
  //   body: Joi.object({
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required().min(6)
  //   }).unknown(false)
  // },

};