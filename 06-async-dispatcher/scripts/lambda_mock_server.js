const jsonParser = input => { try { return JSON.parse(input) } catch (error) { return false } };
const send = ({ status, body, headers }) => { return { statusCode: status, body: JSON.stringify(body), headers } };
const wait = (func, time) => new Promise(r => setTimeout(() => r(func), time));

module.exports.custom_api = async (event) => {
  const query = event.queryStringParameters || {};
  const body = jsonParser(event.body) || { result: query.result || 'OK' };
  const status = query.status || 200;
  const response_time = query.response_time || 0;
  const headers = Object.keys(event.headers).filter(e => e.includes('custom')).reduce((r, e) => { r[e] = event.headers[e]; return r; }, {});
  return await wait(send({ status, body, headers }), response_time);
};