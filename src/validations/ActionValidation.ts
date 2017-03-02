const Joi = require('joi');

export default {
  // GET /actions/:idd
  getAction: {
    body: Joi.object({
    }).unknown(false),
    params: Joi.object({
        id: Joi.number().integer().required()
    }).unknown(false)
  },
};