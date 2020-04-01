// Workaround for serverless offline config support. (MR's welcome here...)
Object.keys(process.env).forEach(key => { if (process.env[key] === '[object Object]') process.env[key] = '' });

module.exports = {
  ENV: process.env.NODE_ENV,
  LOCAL_ENV: 'local',
  AWS_DEFAULT_REGION: 'us-east-1',
  AWS_PROFILE: 'myawsprofile',
  DISPATCHER_TIMEOUT: process.env.DISPATCHER_TIMEOUT * 1000,
  DISPATCHER_RETRY_TIME: process.env.DISPATCHER_RETRY_TIME,
  DISPATCHER_QUEUE: process.env.DISPATCHER_QUEUE, 
  DISPATCHER_DLQ: process.env.DISPATCHER_DLQ 
}