const Joi = require('joi');

export default {
  // GET /actions/:action_id
  needActionId: {
    body: Joi.object({
    }).unknown(false),
    params: Joi.object({
        action_id: Joi.number().integer().required()
    }).unknown(false)
  },
  // PUT /actions/:action_id
  putAction: {  
    body: Joi.object({
      title: Joi.string(),
      subtitle:  Joi.string(), 
      description:  Joi.string(), 
      thanks_msg:  Joi.string(), 
      points:  Joi.number().integer(),
      start_at:  Joi.string(),
      end_at:  Joi.string(),
      param1:  Joi.string(),
      param2:  Joi.string(),
      param3:  Joi.string(),
      param4:  Joi.string(),
    }).unknown(false),
    params: Joi.object({
        action_id: Joi.number().integer().required()
    }).unknown(false)
  },
};