const uuid = require('uuid');

let foods = {};

const cleanUp = async () => foods = {};
const getAll = async () => Object.keys(foods).map(e => foods[e]);
const getItem = async (id) => foods[id];
const createItem = async (item) => {
  const id = uuid();
  item.id = id;
  foods[id] = item;
  return item;
};
const updateItem = async (id, updateFields) => {
  foods[id] = { ...foods[id], ...updateFields };
  return foods[id];
};
const deleteItem = async (id) => delete foods[id];

module.exports = {
  cleanUp,
  getAll,
  getItem,
  createItem,
  updateItem,
  deleteItem
}