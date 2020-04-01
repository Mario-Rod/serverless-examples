const AWSXRay = require('aws-xray-sdk');
const config = require('../../config/index');
const AWS = (config.ENV === config.LOCAL_ENV) ? require('aws-sdk') : AWSXRay.captureAWS(require('aws-sdk'));

const getDefaultConfig = (region = config.AWS_DEFAULT_REGION) => {
  const serviceConfig = { region: region }
  if (config.ENV === config.LOCAL_ENV) serviceConfig.credentials = new AWS.SharedIniFileCredentials({ profile: config.AWS_PROFILE });
  return serviceConfig;
}

let dynamo;
const getDynamoInstance = (config) => {
  if (config) return new AWS.DynamoDB.DocumentClient(config);
  // If the instance with defaultConfig is required, return the singleton...
  if (!dynamo) dynamo = new AWS.DynamoDB.DocumentClient(getDefaultConfig());
  return dynamo;
}

let sqs;
const getSQSInstance = (config) => {
  if (config) return new AWS.SQS(config);
  if (!sqs) sqs = new AWS.SQS(getDefaultConfig());
  return sqs;
}

module.exports = {
  getDynamoInstance,
  getSQSInstance,
}
