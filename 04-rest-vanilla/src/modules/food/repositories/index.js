const uuid = require('uuid');
const config = require('../../../config/index');
const { getDynamoInstance } = require('../../../utils/aws/index');
const dynamo = require('../../../utils/aws/dynamo')(config.TABLES.FOOD, getDynamoInstance());

const getAll = async () => {
  return dynamo.scanTable();
}
const getItem = async (id) => {
  return dynamo.getItem({ id });
}
const createItem = async (item) => {
  item.id = uuid();
  return dynamo.putItem(item);
}
const updateItem = async (id, updateFields = {}) => {
  return dynamo.updateItem({ primaryKey: { id }, updateFields });
}
const deleteItem = async (id) => {
  return dynamo.deleteItem({ id });
}

module.exports = {
  getAll,
  getItem,
  createItem,
  updateItem,
  deleteItem
}