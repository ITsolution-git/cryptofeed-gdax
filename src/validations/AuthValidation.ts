const Joi = require('joi');

export default {
  // POST /auth/register
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6),
      username: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      google_id: Joi.string(),
      faceboook_id: Joi.string()
    }).unknown(false).xor('faceboook_id', 'google_id', 'password')
  },

  // POST auth/login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6)
    }).unknown(false)
  },

  // POST auth/facebook/login
  loginFacebook: {
    body: Joi.object({
      email: Joi.string().email().required()
    }).unknown(false)
  },

  // POST auth/google/login
  loginGoogle: {
    body: Joi.object({
      email: Joi.string().email().required()
    }).unknown(false)
  },

};