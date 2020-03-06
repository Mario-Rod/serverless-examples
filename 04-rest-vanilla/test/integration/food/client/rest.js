const axios = require('axios');

module.exports = url => ({
  req: axios.create({ baseURL: url }),
  async getFoods() { return this.req({ url: `/food` }) },
  async getFood(id) { return this.req({ url: `/food/${id}` }) },
  async createFood(food) { return this.req({ method: 'POST', url: `/food`, data: food }) },
  async updateFood(id, food) { return this.req({ method: 'PUT', url: `/food/${id}`, data: food }) },
  async deleteFood(id) { return this.req({ method: 'DELETE', url: `/food/${id}` }) },
});