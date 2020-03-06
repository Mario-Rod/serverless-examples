const repository = require('../../src/modules/food/repositories/mock');
const foodDomain = require('../../src/modules/food/domain')(repository);

beforeEach(() => repository.cleanUp());

describe('#getFoods', () => {
  test('Empty food array', async () => {
    const foods = await foodDomain.getFoods();
    expect(foods.length).toEqual(0);
  });
  test('One item in food array', async () => {
    await foodDomain.createFood({ name: 'Pasta' });
    const foods = await foodDomain.getFoods();
    expect(foods.length).toEqual(1);
  });
});

describe('#getFood', () => {
  test('Get a food with an id', async () => {
    const { id } = await foodDomain.createFood({ name: 'Rice' });
    const food = await foodDomain.getFood(id);
    expect(food.name).toEqual('Rice');
  });
  test('Get a non-existent food', async () => {
    await foodDomain.getFood('0').catch(e => expect(e).toEqual(Error('foodNotFound')));
  });
});

describe('#createFood', () => {
  test('Create a new food with name Fish', async () => {
    const food = await foodDomain.createFood({ name: 'Fish' });
    expect(food.id).toBeTruthy();
    expect(food.name).toEqual('Fish');
  });
  test('Create a food without name', async () => {
    await foodDomain.createFood().catch(e => expect(e.name).toEqual('ValidationError'));
  });
});

describe('#updateFood', () => {
  test('Update the name of a food, for Caviar', async () => {
    const { id } = await foodDomain.createFood({ name: 'Apple Pie' });
    const updatedFood = await foodDomain.updateFood(id, { name: 'Caviar' });
    const food = await foodDomain.getFood(id);
    expect(updatedFood.id).toEqual(id);
    expect(updatedFood.name).toEqual(food.name);
  });
  test('Update the food with id=1 which not exists', async () => {
    await foodDomain.updateFood(1, 'Caviar').catch(e => expect(e).toEqual(Error('foodNotFound')));
  });
  test('Update the a food without params', async () => {
    const { id } = await foodDomain.createFood({ name: 'Asado' });
    await foodDomain.updateFood(id, '').catch(e => expect(e.name).toEqual('ValidationError'));
  });
});

describe('#deleteFood', () => {
  test('Delete the food with an existing id', async () => {
    const { id } = await foodDomain.createFood({ name: 'Ramen' });
    expect(await foodDomain.deleteFood(id)).toBeFalsy();
    await foodDomain.getFood(id).catch(e => expect(e).toEqual(Error('foodNotFound')));
  });
  test('Delete the food with id=1 which not exists', async () => {
    expect(await foodDomain.deleteFood(1)).toBeFalsy();
  });
  test('Delete a food without send an id', async () => {
    await foodDomain.deleteFood().catch(e => expect(e).toEqual(Error('missingID')));
  });
});