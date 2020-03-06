const Joi = require('@hapi/joi');

const insertSchema = Joi.object({
  name: Joi.string().min(3).max(30).required()
});
const updateSchema = insertSchema;

const validate = (input, schema) => Joi.attempt(input || {}, schema, { stripUnknown: true });

module.exports = {
  validateInsert: (input) => validate(input, insertSchema),
  validateUpdate: (input) => validate(input, updateSchema),
}