const uuid = require('uuid');

// We will use the constant foods as store. Consider that the content only lives in the same execution
// context. So, never follow this approach in a real-case solution, it's just and naive example.
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
const updateItem = async (id, item) => foods[id] = item;
const deleteItem = async (id) => delete foods[id];

module.exports = {
  cleanUp,
  getAll,
  getItem,
  createItem,
  updateItem,
  deleteItem
}