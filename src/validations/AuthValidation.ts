const Joi = require('joi');

export default {
  // POST /auth/register
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6),
      first_name: Joi.string(),
      last_name: Joi.string(),
      google_id: Joi.string(),
      facebook_id: Joi.string(),
      role: Joi.string()
    }).unknown(false).xor('facebook_id', 'google_id', 'password')
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
      email: Joi.string().email().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      facebook_id: Joi.string().required(),
      role: Joi.string()
    }).unknown(false)
  },

  // POST auth/google/login
  loginGoogle: {
    body: Joi.object({
      email: Joi.string().email().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      google_id: Joi.string().required(),
      role: Joi.string()
    }).unknown(false)
  },

};