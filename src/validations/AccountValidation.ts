const Joi = require('joi');

export default {
  // POST /user/
  putAccount: {
    body: {
      user: Joi.object(),
      customer: Joi.object(),
    }
  },

  // GET account/me
  getAccount: {
    params: {
        id: Joi.number().integer().required()
    }
  },
  
  // PUT account/me/password
  putUserpassword: {
    body: Joi.object({
        original_password: Joi.string().required(),
        new_password: Joi.string().required().min(6)
    }).unknown(false)
  },
  
};