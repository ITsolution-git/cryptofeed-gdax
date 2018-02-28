const Joi = require('joi');

export default {
  
  requestPayment: {
    body: Joi.object({
      card_type: Joi.string().required(),
      currency: Joi.string(),
      expect: Joi.string().required(),
      message: Joi.string(),
      callback_url: Joi.string(),

      
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