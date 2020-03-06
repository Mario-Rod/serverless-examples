const foodSchema = require('./schemas/food');

module.exports = repository => ({
  getFoods: async () => {
    try {
      return repository.getAll();
    } catch (error) {
      throw error;
    }
  },
  getFood: async (id) => {
    try {
      if (!id) throw new Error('missingID');
      const food = await repository.getItem(id);
      if (!food || !Object.keys(food).length) throw new Error('foodNotFound');
      return food;
    } catch (error) {
      throw error;
    }
  },
  createFood: async (food) => {
    try {
      return repository.createItem(foodSchema.validateInsert(food));
    } catch (error) {
      throw error;
    }
  },
  updateFood: async (id, updateFields) => {
    try {
      if (!id) throw new Error('missingID');
      const food = await repository.getItem(id);
      if (!food || !Object.keys(food).length) throw new Error('foodNotFound');
      return repository.updateItem(id, foodSchema.validateInsert(updateFields));
    } catch (error) {
      throw error;
    }
  },
  deleteFood: async (id) => {
    try {
      if (!id) throw new Error('missingID');
      await repository.deleteItem(id);
      return;
    } catch (error) {
      throw error;
    }
  },
})