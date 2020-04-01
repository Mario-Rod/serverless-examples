const { getSQSInstance } = require('./index');

module.exports = (queue, sqs = getSQSInstance()) => ({
  async sendMessage({ MessageBody, MessageAttributes, DelaySeconds }) {
    const params = { QueueUrl: queue, MessageBody, MessageAttributes, DelaySeconds };
    return sqs.sendMessage(params).promise();
  },
  async changeMessageVisibility({ ReceiptHandle, VisibilityTimeout }) {
    const params = { QueueUrl: queue, ReceiptHandle, VisibilityTimeout };
    return sqs.changeMessageVisibility(params).promise();
  },
});