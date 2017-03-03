const Joi = require('joi');

export default {
  // GET /actions/:idd
  needActionId: {
    body: Joi.object({
    }).unknown(false),
    params: Joi.object({
        action_id: Joi.number().integer().required()
    }).unknown(false)
  },
};