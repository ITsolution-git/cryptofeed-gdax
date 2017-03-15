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

  // POST auth/facebook/login
  loginFacebook: {
    body: Joi.object({
      email: Joi.string().email().required(),
      facebook: Joi.string()
    }).unknown(false)
  },

  // POST auth/facebook/register
  registerFacebook: {
    body: Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      avatar_file: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      facebook: Joi.string().required()
    }).unknown(false)
  },

  // POST auth/twitter/register
  registerTwitter: {
    body: Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      avatar_file: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      twitter: Joi.string().required()
    }).unknown(false)
  }
  ,
  // POST auth/twitter/login
  loginTwitter: {
    body: Joi.object({
      email: Joi.string().email().required(),
      twitter: Joi.string()
    }).unknown(false)
  }
};