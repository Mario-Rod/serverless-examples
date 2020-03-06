const AWS = require('aws-sdk');
const config = require('../../config/index');

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

module.exports = {
  getDynamoInstance,
}