module.exports = {
  ENV: process.env.NODE_ENV,
  LOCAL_ENV: 'local',
  AWS_DEFAULT_REGION: 'us-east-1',
  AWS_PROFILE: 'myawsprofile',
  TABLES: {
    FOOD: process.env.TABLE_FOODS,
  }
}