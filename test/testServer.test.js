// https://www.freecodecamp.org
const request = require('supertest');
const app = require('../src/server/index');

describe('GET / ', () => {
  test('Server should respond', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});