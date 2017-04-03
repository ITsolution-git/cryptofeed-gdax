const Joi = require('joi');

export default {
  // GET /groups
  getPublicGroups: {
    query: Joi.object({
        lat: Joi.number().optional(),
        long: Joi.number().optional(),
        distance: Joi.number().optional(),
        tag: Joi.string().regex(/[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*/).optional(),
        group_code: Joi.string().token().optional(),
        query: Joi.any().optional()
    }).with('lat', 'long', 'distance').unknown(false)
  },


  // GET /groups/:group_id
  getGroup: {
    params: Joi.object({
        group_id: Joi.number().integer().required()
    }).unknown(false)
  },
  
  // POST /groups
  createGroup: {
    body: Joi.object({
        name: Joi.string().required(),
        private: Joi.boolean().required(),
        description: Joi.string(),
        welcome: Joi.string(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        banner_image_file: Joi.any(),
        // allow_member_action: Joi.boolean().optional(),
        // member_action_level: Joi.number().optional()
    }).unknown(false)
  },


  // PUT /groups
  putGroup: {
    body: Joi.object({
        name: Joi.string().optional(),
        private: Joi.boolean().optional(),
        description: Joi.string(),
        welcome: Joi.string(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        banner_image_file: Joi.any(),
        allow_member_action: Joi.boolean().optional(),
        member_action_level: Joi.number().optional()
    }).unknown(false),
    params: Joi.object({
      group_id: Joi.number().integer().required()
    }).unknown(false)
  },
  
  // GET /groups/:group_id/members
  getGroupMembers: {
    params: Joi.object({
      group_id: Joi.number().integer().required()
    }).unknown(false)
  },

  // POST /groups/:group_id/members
  joinGroup: {
    params: Joi.object({
      group_id: Joi.number().integer().required()
    }).unknown(false),
    body: Joi.object({
      group_code: Joi.string().optional()
    }).unknown(false)
  },

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

  // DELETE  /groups/:group_id
  deleteGroup: {
    params: Joi.object({
      group_id: Joi.number().integer().required()
    }).unknown(false),
    body: Joi.object({

    }).unknown(false)
  },

  //PUT /groups/:group_id/members/:user_id
  updateGroupMember: {
    params: Joi.object({
      group_id: Joi.number().integer().required(),
      user_id: Joi.number().integer().required()
    }).unknown(false),
    body: Joi.object({
      admin_settings: Joi.boolean().optional(),
      admin_members: Joi.boolean().optional(),
      mod_actions: Joi.boolean().optional(),
      mod_comments: Joi.boolean().optional(),
      submit_action: Joi.boolean().optional(),
      banned: Joi.boolean().optional(),
      banned_reason: Joi.string().optional(),
    }).unknown(false)
  }
};