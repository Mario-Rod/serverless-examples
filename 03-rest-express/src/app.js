const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const app = express();
const apiFood = require('./food/api');
const package = require('../package.json.js');

// Input parser middlewares
app.use(bodyParser.json({ type: 'application/json' }));
app.use(awsServerlessExpressMiddleware.eventContext());
// APIs
app.get('/api/version', (req, res) => res.status(200).json({ version: package.version }));
app.use('/api/food', apiFood);

// Error handlers middlewares
app.use((req, res, next) => next(new Error('notFound')));
app.use((err, req, res, next) => {
  let statusCode = 500;
  if (err.message.toLowerCase().includes('notfound')) statusCode = 404;
  if (err.message.toLowerCase().includes('clienterror')) statusCode = 400;
  res.status(statusCode).json({ error: err.message });
});

const server = awsServerlessExpress.createServer(app);

module.exports = (event, context) => {
  try {
    return awsServerlessExpress.proxy(server, event, context);
  } catch (error) {
    throw error;
  }
}