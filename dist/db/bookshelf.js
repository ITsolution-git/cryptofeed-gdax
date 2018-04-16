"use strict";
const environment = process.env.NODE_ENV;
const config = require('../../knexfile.js')[environment];
exports.knex = require('knex')(config);
var validator = require('validator');
validator.isRequired = function (str, options) {
    return str !== undefined;
};
var bookshelf = require('bookshelf')(exports.knex);
bookshelf.plugin('bookshelf-validate', {
    validator: validator,
    validateOnSave: true
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookshelf;
//# sourceMappingURL=bookshelf.js.map