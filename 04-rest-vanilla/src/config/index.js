// Workaround for serverless offline config support. (MR's welcome here...)
Object.keys(process.env).forEach(key => { if (process.env[key] === '[object Object]') process.env[key] = '' });

module.exports = {
  ENV: process.env.NODE_ENV,
  LOCAL_ENV: 'local',
  AWS_DEFAULT_REGION: 'us-east-1',
  AWS_PROFILE: 'myawsprofile',
  TABLES: {
    FOOD: process.env.TABLE_FOODS || 'restvanilla-dev-table-foods',
  }
}