const config = require('./config');
const uuid = require('uuid');

module.exports = {
  helloWorld: async () => {
    console.log(config);
    console.log(config.get('NODE_ENV'));
    return `Hello ${uuid()}`;
  }
};