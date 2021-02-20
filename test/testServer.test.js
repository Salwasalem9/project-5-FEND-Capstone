// https://www.freecodecamp.org/news/end-point-testing/#part1
const request = require('supertest');
const app = require('../src/server/index');

describe('GET / ', () => {
  test('Server should respond', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});