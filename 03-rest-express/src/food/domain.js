const repository = require('./repository');

const getFoods = async () => {
  try {
    return repository.getAll();
  } catch (error) {
    throw error;
  }
}
const getFood = async (id) => {
  try {
    if (!id) throw new Error('clientErrorGetFoodInputValidation');
    const food = await repository.getItem(id);
    if (!food) throw new Error('foodNotFound');
    return food;
  } catch (error) {
    throw error;
  }
}
const createFood = async (name) => {
  try {
    if (!name) throw new Error('clientErrorCreateFoodInputValidation');
    const food = { name: name };
    await repository.createItem(food);
    return food;
  } catch (error) {
    throw error;
  }
}
const updateFood = async (id, name) => {
  try {
    if (!id || !name) throw new Error('clientErrorUpdateFoodInputValidation');
    const food = await repository.getItem(id)
    if (!food) throw new Error('foodNotFound');
    food.name = name;
    await repository.updateItem(food.id, food);
    return food;
  } catch (error) {
    throw error;
  }
}
const deleteFood = async (id) => {
  try {
    if (!id) throw new Error('clientErrorDeleteFoodInputValidation');
    await repository.deleteItem(id);
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood
}