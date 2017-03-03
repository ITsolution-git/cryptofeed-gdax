const Joi = require('joi');

export default {
  // GET /groups/:group_id/actions
  getGroupActions: {
    params: Joi.object({
        group_id: Joi.number().integer().required()
    }).unknown(false)
  },

  // POST /groups/:group_id/actions
  createGroupAction : {
    body: Joi.object({
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      description: Joi.string().required(),
      thanks_msg: Joi.string().required(),
      points: Joi.number().integer(),
      start_at: Joi.date(),
      end_at: Joi.date(),
      action_type_id: Joi.number().integer().required(),
      param1: Joi.string(),
      param2: Joi.string(), 
      param3: Joi.string(),
      param4: Joi.string()
    }).unknown(false),
    params: Joi.object({
        group_id: Joi.number().integer().required()
    }).unknown(false)
  },

};