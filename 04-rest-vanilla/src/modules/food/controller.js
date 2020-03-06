const repository = require('./repositories');
const domain = require('./domain')(repository);
const { send, errorHandler, bodyParser } = require('../../utils/commons');

module.exports = {
  getFoods: async (event) => {
    try {
      return send(200, await domain.getFoods());
    } catch (error) {
      return errorHandler(error);
    }
  },
  getFood: async (event) => {
    try {
      return send(200, await domain.getFood(event.pathParameters.id));
    } catch (error) {
      return errorHandler(error);
    }
  },
  createFood: async (event) => {
    try {
      const food = bodyParser(event);
      return send(201, await domain.createFood(food));
    } catch (error) {
      return errorHandler(error);
    }
  },
  updateFood: async (event) => {
    try {
      const food = bodyParser(event);
      return send(201, await domain.updateFood(event.pathParameters.id, food));
    } catch (error) {
      return errorHandler(error);
    }
  },
  deleteFood: async (event) => {
    try {
      await domain.deleteFood(event.pathParameters.id);
      return send(204);
    } catch (error) {
      return errorHandler(error);
    }
  },
};