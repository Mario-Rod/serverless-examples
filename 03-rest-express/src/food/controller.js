const domain = require('./domain');

const getFoods = async (req, res, next) => {
  try {
    const foods = await domain.getFoods();
    res.status(200).json({ foods });
  } catch (error) {
    next(error);
  }
}
const getFood = async (req, res, next) => {
  try {
    const food = await domain.getFood(req.params.id);
    res.status(200).json(food);
  } catch (error) {
    next(error);
  }
}
const createFood = async (req, res, next) => {
  try {
    const food = await domain.createFood(req.body.name);
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
}
const updateFood = async (req, res, next) => {
  try {
    const food = await domain.updateFood(req.params.id, req.body.name);
    res.status(200).json(food);
  } catch (error) {
    next(error);
  }
}
const deleteFood = async (req, res, next) => {
  try {
    await domain.deleteFood(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood
}