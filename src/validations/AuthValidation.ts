const Joi = require('joi');

export default {
  // POST /auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
      username: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string()
    }
  },

  // POST auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6)
    }
  }
};