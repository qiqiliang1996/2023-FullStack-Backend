let server;

const request = require('supertest');

describe('/posts', () => {
  beforeAll(() => {
    server = require('../../index');
  });
  afterAll(() => {
    server.close();
  });

  describe('GET /', () => {
    it('should return all users', async () => {
      const res = await request(server).get('/posts');
      expect(res.status).toBe(200);
    });
  });
});
