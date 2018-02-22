const Joi = require('joi');

export default {
  // POST /auth/register
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
      username: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string()
    }).unknown(false)
  },

  // POST auth/login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6)
    }).unknown(false)
  },

};