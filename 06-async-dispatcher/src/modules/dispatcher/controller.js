const dispatch = require('./dispatch');
const sqs = require('../../../src/utils/aws/sqs');
const config = require('../../config');

const toJSON = (input) => { try { return JSON.parse(input); } catch (error) { return {}; } };
const resultHandler = {
  SUCCESS: async () => true,
  SERVER_ERROR: async (message) => {
    // Retry policy
    const newWaitingTime = config.DISPATCHER_RETRY_TIME * message.attributes.ApproximateReceiveCount;
    await sqs(config.DISPATCHER_QUEUE).changeMessageVisibility({ ReceiptHandle: message.receiptHandle, VisibilityTimeout: newWaitingTime });
    throw new Error('SERVER_ERROR');
  },
  CLIENT_ERROR: async (message, dispatchResult) => {
    // Send directly to Dead Letter Queue
    await sqs(config.DISPATCHER_DLQ).sendMessage({ MessageBody: JSON.stringify(dispatchResult) });
    return true;
  },
}

module.exports = {
  dispatch: async (event, context) => {
    console.log(JSON.stringify({ input: { event, context } }));
    const message = event.Records[0];
    const dispatchResult = await dispatch(toJSON(message.body));
    const logs = [{ result: dispatchResult.result, id: dispatchResult.request.id, response: { code: dispatchResult.response.status, data: dispatchResult.response.data } }];
    const stats = { TOTAL: 1 };
    stats[dispatchResult.result] = 1;
    console.log(JSON.stringify({ result: { logs, stats } }));
    return resultHandler[dispatchResult.result](message, dispatchResult);
  }
}