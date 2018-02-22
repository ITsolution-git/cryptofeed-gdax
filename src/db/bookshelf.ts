const environment = process.env.NODE_ENV;
const config = require('../../knexfile.js')[environment];
export var knex = require('knex')(config);

var validator = require('validator');


validator.isRequired = function(str, options){
  return str !== undefined;
}
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-validate', {
  validator: validator,
  validateOnSave: true 
});

export default bookshelf;