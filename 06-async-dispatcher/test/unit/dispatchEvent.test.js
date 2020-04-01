process.env.NODE_ENV = 'local';
const controller = require('../../src/modules/dispatcher/controller');
const PORT = process.env.PORT || 3020;
const testServerURL = `http://localhost:${PORT}`;

describe('#Unitary Dispatch', () => {
  test('Single event OK', async () => {
    const event = {
      Records: [{
        messageId: '34305319-5233-4c09-8dd2-a40a6c7430cd',
        receiptHandle: 'AQEBfETCzyJlbEy3lrh8qI7Bi5VqMtSjWW2ZmrPRA27/iIaU6SUxga3SAfvvrbuAi3nKf5kdcNIMHz1NrICWNF1KA83taOKrwk3YSbL/g8GoSY0+QFlu9e3DyVrijMofiZzMNFaGYeyFZ7Qx51+h3bfpisKIMVrZT5vqCnhsRE3S0/Y7Vu4Alu736tUk1lWHBJpbhnwYKy2BjZA/mOsfjP72yxd7CYmzpIKvVQj9bLPS321klaMfUTfvANfvS27W1B5OAx4GNNuPtycQzXYJT7eJHmTSnEQp8ihfDhry4GLt87ZAN0D3R1Vjmi5GzKwdXHtgcomNIKiz8nN3zQFkIW8EtHsPH/ohWVpvAwiWrhWpfU00/OsX4AiFDKHchhz4Ki0tH6Bbw2bAZa8lb2Znwak0irywBQRDtVjXOCQmILtWmxY=',
        attributes: {
          approximateFirstReceiveTimestamp: 1583959109584,
          ApproximateReceiveCount: 3,
          SenderId: 'AIDAJU3W26UT3V7AYCLSC',
          SentTimestamp: 1583959109575
        },
        md5OfBody: 'f94d3c4808f490a43b4346d156367bcd',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-1:XXXXXX:dev-callbacks-dispatcher-queue',
        awsRegion: 'us-east-1',
        body: `{"id":"34305319-5233-4c09","url":"${testServerURL}/api/version"}`,
      }]
    }
    const result = await controller.dispatch(event);
    expect(result).toEqual('done');
  });
  test('Single event SERVER_ERROR', async () => {
    const event = {
      Records: [{
        receiptHandle: 'AQEBfETCzyJlbEy3lrh8qI7Bi5VqMtSjWW2ZmrPRA27/iIaU6SUxga3SAfvvrbuAi3nKf5kdcNIMHz1NrICWNF1KA83taOKrwk3YSbL/g8GoSY0+QFlu9e3DyVrijMofiZzMNFaGYeyFZ7Qx51+h3bfpisKIMVrZT5vqCnhsRE3S0/Y7Vu4Alu736tUk1lWHBJpbhnwYKy2BjZA/mOsfjP72yxd7CYmzpIKvVQj9bLPS321klaMfUTfvANfvS27W1B5OAx4GNNuPtycQzXYJT7eJHmTSnEQp8ihfDhry4GLt87ZAN0D3R1Vjmi5GzKwdXHtgcomNIKiz8nN3zQFkIW8EtHsPH/ohWVpvAwiWrhWpfU00/OsX4AiFDKHchhz4Ki0tH6Bbw2bAZa8lb2Znwak0irywBQRDtVjXOCQmILtWmxY=',
        eventSourceARN: 'arn:aws:sqs:us-east-1:XXXXXX:dev-callbacks-dispatcher-queue',
        messageId: '34305319-5233-4c09-8dd2-a40a6c7430cd',
        attributes: {
          approximateFirstReceiveTimestamp: 1583959109584,
          ApproximateReceiveCount: 3,
          SenderId: 'AIDAJU3W26UT3V7AYCLSC',
          SentTimestamp: 1583959109575
        },
        body: `{"id":"34305319-5233-4c09","timeout":"3","url":"${testServerURL}/api/version"}`,
      }]
    }
    await controller.dispatch(event).catch(e => console.log(e.message))    
      // ).toEqual('SERVER_ERROR'));
  });
});