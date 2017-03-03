const Joi = require('joi');

export default {
  // POST /groups/:group_id/actions
  getGroupActions: {
    params: Joi.object({
        group_id: Joi.number().integer().required()
    }).unknown(false)
  },

};