const api = require('express').Router();
const controller = require('./controller');

api.get('/', controller.getFoods);
api.get('/:id', controller.getFood);
api.post('/', controller.createFood);
api.put('/:id', controller.updateFood);
api.delete('/:id', controller.deleteFood);

module.exports = api;