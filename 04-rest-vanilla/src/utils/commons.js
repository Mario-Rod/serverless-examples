const package = require('../../package.json');
const errorCatalog = require('../config/errorCatalog');

const send = (status, body) => {
  try {
    const response = { statusCode: status };
    if (status == '204') return response;
    if (!body) throw new Error('internalErrorEmptyBodyInResponse');
    response.body = JSON.stringify(body);
    return response;
  } catch (error) {
    if (error.message.includes('Unexpected token')) error.message = 'badInputInSendMethod';
    return errorHandler(error);
  }

};
const bodyParser = ({ body } = {}) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    error.name = 'ValidationError';
    throw error;
  }
};
const errorHandler = (error) => {
  // Full Error Logging
  console.log(error);
  // Commons Errors Parsing
  if (error.message === 'missingID') error.name = 'missingID';
  if (error.message.toString().toLowerCase().includes('notfound')) error.name = 'resourceNotFound';
  if (error.code === 'AccessDeniedException') error.name = 'AccessDeniedException';
  // Error Catalog
  const responseError = errorCatalog[error.name] || errorCatalog['internalError'];
  if (responseError.detail) responseError.detail = error.message;
  const statusCode = responseError.status;
  delete responseError.status;
  return send(statusCode, { error: responseError });
};
const version = async () => send(200, { version: package.version });

module.exports = {
  send,
  bodyParser,
  errorHandler,
  version,
}