const axios = require('axios');
axios.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() }
  return config;
}, error => Promise.reject(error));
axios.interceptors.response.use(response => {
  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
  return response;
}, error => {
  error.config.metadata.endTime = new Date();
  error.response = (error.response) ? error.response : {};
  error.response.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

const { DISPATCHER_TIMEOUT } = require('../../config');
const { isValid } = require('./schemas/destination');

module.exports = async (destination) => {
  try {
    const { error, value: validDestination } = isValid(destination);
    if (error) return { result: 'CLIENT_ERROR', request: destination, response: { status: 400, data: error.details[0].message, duration: 0 } };
    const { method, url, body, headers, timeout } = validDestination;
    const request = { method, url, headers, timeout: timeout || DISPATCHER_TIMEOUT };
    if (body) request.data = body;
    const { status, data, duration, headers: responseHeaders } = await axios(request).catch(e => {
      if (Object.keys(e.response).length < 2) return { status: 999, data: e.message, duration: 0 };
      return e.response;
    });
    let result = '';
    if (status >= 200 && status < 300) result = 'SUCCESS';
    if (status >= 400 && status < 500) result = 'CLIENT_ERROR';
    if (status >= 500) result = 'SERVER_ERROR';
    return { result: result, request: validDestination, response: { status, data, duration, responseHeaders } };
  } catch (error) {
    throw error;
  }
}