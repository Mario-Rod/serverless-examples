const Joi = require('@hapi/joi');
const config = require('../../../config');

const insertSchema = Joi.object({
  id: Joi.string().required(),
  url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  method: Joi.string().default('GET').insensitive().valid('POST', 'PUT', 'GET'),
  body: Joi.string(),
  headers: Joi.object(),
  timeout: Joi.number().max(config.DISPATCHER_TIMEOUT),
});
const updateSchema = insertSchema;

const validate = (input, schema) => Joi.attempt(input || {}, schema, { stripUnknown: true });
const isValid = (input, schema) => schema.validate(input);


module.exports = {
  isValid: (input) => isValid(input, insertSchema),
  validateInsert: (input) => validate(input, insertSchema),
  validateUpdate: (input) => validate(input, updateSchema),
}