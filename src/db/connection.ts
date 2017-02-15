const environment = process.env.NODE_ENV;
const config = require('../../knexfile.js')[environment];
var knex = require('knex')(config);
module.exports = require('bookshelf')(knex);
