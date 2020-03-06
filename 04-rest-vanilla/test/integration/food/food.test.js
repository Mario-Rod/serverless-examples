/**
 * @jest-environment node
 */

const rawUrl = process.env.TEST_ENDPOINT;
const url = (rawUrl.endsWith('/api')) ? rawUrl : `${rawUrl.substring(0, rawUrl.indexOf('/api'))}/api`;
const foodInterface = require('./client/rest')(url);

console.log('Starting Integration test at: ', url);

describe('#getFoods', () => {
  test('Empty food array', async () => {
    const { data: foods, status } = await foodInterface.getFoods();
    expect(status).toEqual(200);
    expect(foods.length).toEqual(0);
  });
  test('One item in food array', async () => {
    await foodInterface.createFood({ name: 'Pasta' });
    const { data: foods, status } = await foodInterface.getFoods();
    expect(status).toEqual(200);
    expect(foods.length).toEqual(1);
  });
});

describe('#getFood', () => {
  test('Get a food with an id', async () => {
    const { data: { id } } = await foodInterface.createFood({ name: 'Rice' });
    const { data: food, status } = await foodInterface.getFood(id);
    expect(status).toEqual(200);
    expect(food.name).toEqual('Rice');
  });
  test('Get a non-existent food', async () => {
    await foodInterface.getFood(0).catch(({ response: { data, status } }) => {
      expect(status).toEqual(404);
      expect(data.error.code).toEqual('resource_not_found');
    });
  });
});

describe('#createFood', () => {
  test('Create a new food with name Fish', async () => {
    const { data: food, status } = await foodInterface.createFood({ name: 'Fish' });
    expect(status).toEqual(201);
    expect(food.id).toBeTruthy();
    expect(food.name).toEqual('Fish');
  });
  test('Create a food without name', async () => {
    await foodInterface.createFood().catch(({ response: { data, status } }) => {
      expect(status).toEqual(400);
      expect(data.error.code).toEqual('client_input_validation');
    });
  });
});

describe('#updateFood', () => {
  test('Update the name of a food, for Caviar', async () => {
    const { data: { id } } = await foodInterface.createFood({ name: 'Apple Pie' });
    const { data: updatedFood, status } = await foodInterface.updateFood(id, { name: 'Caviar' });
    expect(status).toEqual(201);
    const { data: food } = await foodInterface.getFood(id);
    expect(updatedFood.id).toEqual(id);
    expect(updatedFood.name).toEqual(food.name);
  });
  test('Update the food with id=1 which not exists', async () => {
    await foodInterface.updateFood(1, { name: 'Caviar' }).catch(({ response: { data, status } }) => {
      expect(status).toEqual(404);
      expect(data.error.code).toEqual('resource_not_found');
    });
  });
  test('Update the a food without params', async () => {
    const { data: { id } } = await foodInterface.createFood({ name: 'Asado' });
    await foodInterface.updateFood(id, null).catch(({ response: { data, status } }) => {
      expect(status).toEqual(400);
      expect(data.error.code).toEqual('client_input_validation');
    });
  });
});

describe('#deleteFood', () => {
  test('Delete the food with an existing id', async () => {
    const { data: { id } } = await foodInterface.createFood({ name: 'Ramen' });
    const { data: food, status } = await foodInterface.deleteFood(id);
    expect(food).toBeFalsy();
    expect(status).toEqual(204);
    await foodInterface.getFood(id).catch(({ response: { data, status } }) => {
      expect(status).toEqual(404);
      expect(data.error.code).toEqual('resource_not_found');
    });
  });
  test('Delete the food with id=1 which not exists', async () => {
    const { data: food, status } = await foodInterface.deleteFood(1);
    expect(food).toBeFalsy();
    expect(status).toEqual(204);
  });
});