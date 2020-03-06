module.exports = (tableName, dynamo) => ({
  async scanTable({ filterExpression, expressionValues, expressionNames, projection } = {}) {
    try {
      const params = {
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionValues,
        ExpressionAttributeNames: expressionNames,
        ProjectionExpression: projection,
      };
      const { Items } = await dynamo.scan(params).promise();
      if (!Items) return [];
      return Items;
    } catch (error) {
      throw error;
    }
  },
  async queryTable({ expressionCondition, filterExpression, expressionValues, expressionNames, projection } = {}) {
    try {
      const params = {
        TableName: tableName,
        KeyConditionExpression: expressionCondition,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionValues,
        ExpressionAttributeNames: expressionNames,
        ProjectionExpression: projection,
      };
      const { Items } = await dynamo.query(params).promise();
      if (!Items) return [];
      return Items;
    } catch (error) {
      throw error;
    }
  },
  async getItem(primaryKey = {}) {
    try {
      const params = {
        TableName: tableName,
        Key: primaryKey,
      };
      const { Item } = await dynamo.get(params).promise();
      if (!Item) return {};
      return Item;
    } catch (error) {
      throw error;
    }
  },
  async putItem(item = {}) {
    try {
      const params = {
        TableName: tableName,
        Item: item,
      };
      await dynamo.put(params).promise();
      return item;
    } catch (error) {
      throw error;
    }
  },
  async updateItem({ primaryKey, updateFields, conditionExpression, returnValue = 'ALL_NEW' } = {}) {
    try {
      let updateExpression = 'SET ';
      const expressionNames = {};
      const expressionValues = {};
      Object.keys(updateFields).forEach(key => {
        updateExpression += `#${key}=:${key}`;
        expressionNames[`#${key}`] = key;
        expressionValues[`:${key}`] = updateFields[key];
      });
      const params = {
        TableName: tableName,
        Key: primaryKey,
        UpdateExpression: updateExpression,
        ConditionExpression: conditionExpression,
        ExpressionAttributeValues: expressionValues,
        ExpressionAttributeNames: expressionNames,
        ReturnValues: returnValue,
      };
      const { Attributes } = await dynamo.update(params).promise();
      if (!Attributes) return {};
      return Attributes;
    } catch (error) {
      throw error;
    }
  },
  async deleteItem(primaryKey = {}) {
    try {
      const params = {
        TableName: tableName,
        Key: primaryKey,
      };
      await dynamo.delete(params).promise();
    } catch (error) {
      throw error;
    }
  },
});