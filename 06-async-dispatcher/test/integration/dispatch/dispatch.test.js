process.env.NODE_ENV = 'local';

const testServerURL = process.env.TEST_ENDPOINT;
const queue = process.env.QUEUE_ENDPOINT;
const sqs = require('../../../src/utils/aws/sqs')(queue);

console.log('Starting Integration test at: ', queue, 'against', testServerURL);

describe('#sendCallbacks', () => {
  test('Single message in single request', async () => {
    const message = { id: 'single-message-ok', method: 'GET', url: `${testServerURL}/api/version` };
    const result = await sqs.sendMessage({ MessageBody: JSON.stringify(message) });
    console.log(result);
  });
  test('Single message in single request BAD', async () => {
    const message = { id: 'single-message-with-low-timeout', method: 'GET', timeout: 3, url: `${testServerURL}/api/custom` };
    const result = await sqs.sendMessage({ MessageBody: JSON.stringify(message) });
    console.log(result);
  });
  test('Sigle message with delay', async () => {
    const message = { id: 'single-message-with-delay', method: 'GET', url: `${testServerURL}/api/custom` };
    const result = await sqs.sendMessage({ DelaySeconds: 10, MessageBody: JSON.stringify(message) });
    console.log(result);
  });
});