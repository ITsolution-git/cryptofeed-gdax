const environment = process.env.NODE_ENV;
const config = require('../../knexfile.js')[environment];
var knex = require('knex')(config);

var validator = require('validator');

// validator.isPrime = function (str) {
//   var value = parseInt(str);
//   if (value === NaN || value < 2) return false;

//   for (var i = 2; i <= value >> 1; i++) {
//     if (value % i === 0) {
//       return false;
//     }
//   }
// };

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-validate', {
  validator: validator,
  validateOnSave: false 
});
export default bookshelf;