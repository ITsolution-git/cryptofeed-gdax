const Joi = require('joi');

export default {
  // POST /user/
  putUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6),
      username: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      bio: Joi.string(),
    }
  },

  // GET user/
  getUser: {
    params: {
        id: Joi.number().integer().required()
    }
  },
  
  // GET user/groups
  getUserGroups: {
    params: {
        id: Joi.number().integer().required()
    }
  },

  // PUT user/password
  putUserpassword: {
    body: {
        original_password: Joi.string().required(),
        new_password: Joi.string().required().min(6)
    }
  }
};