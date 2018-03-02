const Joi = require('joi');

export default {
  
  requestPayment: {
    body: Joi.object({
      currency: Joi.string(),
      message: Joi.string(),

      amount: Joi.number().required(),
      exchange_rate: Joi.string().required(),
      card_amount: Joi.string().required(),
      discount: Joi.string().required(),
      btc_amount: Joi.string().required(),

      customer: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required()
      })
    }).unknown(true)
  },

  // // POST auth/login
  // login: {
  //   body: Joi.object({
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required().min(6)
  //   }).unknown(false)
  // },

};