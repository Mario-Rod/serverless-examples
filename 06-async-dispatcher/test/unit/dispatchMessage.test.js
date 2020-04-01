const dispatch = require('../../src/modules/dispatcher/dispatch');
const { DISPATCHER_TIMEOUT } = require('../../src/config');

const PORT = process.env.PORT || 3020;
const testServerURL = `http://localhost:${PORT}`;

describe('#Valid Dispatch', () => {
  test('Valid request with GET method', async () => {
    const destination = {
      id: '32r242-valid-request-method',
      method: 'GET',
      url: `${testServerURL}/api/custom`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SUCCESS');
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(typeof response.duration).toBe('number');
  });
  test('Valid request without method', async () => {
    const destination = {
      id: '32r242-valid-missing-method',
      url: `${testServerURL}/api/custom`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SUCCESS');
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(typeof response.duration).toBe('number');
  });
  test('Valid request with Timeout', async () => {
    const destination = {
      id: '32r242-valid-custom-timeout',
      method: 'GET',
      url: `${testServerURL}/api/custom`,
      timeout: DISPATCHER_TIMEOUT - 500
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SUCCESS');
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(typeof response.duration).toBe('number');
  });
  test('Valid request with Custom Headers', async () => {
    const destination = {
      id: '32r242-2342fwf-32fsfs3sd-32fsd',
      method: 'GET',
      url: `${testServerURL}/api/custom?id=with_headers`,
      headers: { 'custom-x-transac-id': '3245252', 'custom-authorization': 'Bearer efk3kas.fkjf23.wefw2' },
    };
    const { result, request, response } = await dispatch(destination);
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(response.responseHeaders['custom-x-transac-id']).toEqual('3245252');
    expect(response.responseHeaders['custom-authorization']).toEqual('Bearer efk3kas.fkjf23.wefw2');
    expect(typeof response.duration).toBe('number');
  });
  test('Valid request with POST method and Body', async () => {
    const body = { external_id: 129324622, operator: 'John Doe' };
    const destination = {
      id: '32r242-2342fwf-32fsfs3sd-32fsd',
      method: 'POST',
      url: `${testServerURL}/api/custom`,
      body: JSON.stringify(body),
    }
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SUCCESS');
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(response.data.external_id).toEqual(body.external_id);
    expect(response.data.operator).toEqual(body.operator);
    expect(typeof response.duration).toBe('number');
  });
});

describe('#Failed Dispatch', () => {
  test('Timeout failiure', async () => {
    const timeout = 2000;
    const destination = {
      id: '32r242-2342fwf-32fsfs3sd-32fsd',
      method: 'GET',
      url: `${testServerURL}/api/custom?response_time=${timeout+500}`,
      timeout: timeout
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SERVER_ERROR');
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toEqual(999);
    expect(response.data).toEqual(`timeout of ${timeout}ms exceeded`);
    expect(typeof response.duration).toBe('number');
  });
  test('Connection Refused', async () => {
    const destination = {
      id: '32r242-2342fwf-32fsfs3sd-32fsd',
      method: 'GET',
      url: `${testServerURL}1/api/ok`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SERVER_ERROR');
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toEqual(999);
    expect(response.data).toEqual(`connect ECONNREFUSED 127.0.0.1:${PORT}1`);
    expect(typeof response.duration).toBe('number');
  });
  test('Response 4xx', async () => {
    const destination = {
      id: '32r242-2342fwf-32fsfs3sd-32fsd',
      method: 'GET',
      url: `${testServerURL}/api/custom?status=400`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
    expect(typeof response.duration).toBe('number');
  });
  test('Response 5xx', async () => {
    const destination = {
      id: '32r242-2342fwf-32fsfs3sd-32fsd',
      method: 'GET',
      url: `${testServerURL}/api/custom?status=500`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('SERVER_ERROR');
    expect(destination.timeout).toEqual(request.timeout);
    expect(destination.id).toEqual(request.id);
    expect(response.status).toBeGreaterThanOrEqual(500);
    expect(response.status).toBeLessThan(600);
    expect(typeof response.duration).toBe('number');
  });
});

describe('#Invalid Request to Dispatch', () => {
  test('Empty destination', async () => {
    const destination = {};
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(response.status).toEqual(400);
    expect(response.data).toEqual('"id" is required');
  });
  test('Missing id', async () => {
    const destination = {
      method: 'get',
      url: `${testServerURL}/api/ok`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(response.status).toEqual(400);
    expect(response.data).toEqual('"id" is required');
  });
  test('Invalid request method', async () => {
    const destination = {
      id: '32r242-invalid-request-method',
      method: 'gets',
      url: `${testServerURL}/api/ok`,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(response.status).toEqual(400);
    expect(response.data).toEqual('"method" must be one of [POST, PUT, GET]');
  });
  test('Missing url', async () => {
    const destination = {
      id: '32r242-missing-url',
      method: 'GET',
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(response.status).toEqual(400);
    expect(response.data).toEqual('"url" is required');
  });
  test('Invalid url', async () => {
    const destination = {
      id: '32r242-invalid-url',
      method: 'GET',
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(response.status).toEqual(400);
    expect(response.data).toEqual('"url" is required');
  });
  test('Overpast timeout', async () => {
    const destination = {
      id: '32r242-overpast-timeout',
      method: 'GET',
      url: `${testServerURL}/api/ok`,
      timeout: DISPATCHER_TIMEOUT + 500,
    };
    const { result, request, response } = await dispatch(destination);
    expect(result).toEqual('CLIENT_ERROR');
    expect(response.status).toEqual(400);
    expect(response.data).toEqual(`"timeout" must be less than or equal to ${DISPATCHER_TIMEOUT}`);
  });
});