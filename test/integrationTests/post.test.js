let server;
const request = require('supertest');
const mongoose = require('mongoose');

const { Post } = require('../../models/Post');
const { User } = require('../../models/User');

describe('POSTs endpoint', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Post.remove({}); //remove everything after you insertMany
  });

  describe('GET /post', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server)
        .post('/posts')
        .send({ description: '/post - post description: user did not log in' });

      expect(response.status).toBe(401);
    });
    it('should return all posts', async () => {
      await Post.insertMany([
        {
          userId: '63e563d84b9ed7dc2ee4d411',
          firstName: 'Qiqi',
          lastName: 'Liang',
          description: 'this is for jest test getFeed',
        },
      ]);
      const token = new User().generateAuthToken();
      const res = await request(server)
        .get('/posts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(
        res.body.some((post) => post.userId === '63e563d84b9ed7dc2ee4d411')
      ).toBeTruthy();
    });
  });

  describe('GET /:userId/posts', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server).get(
        `/posts/${new mongoose.Types.ObjectId()}/posts`
      );

      expect(response.status).toBe(401);
    });
    it('should return all posts from a given userId', async () => {
      const token = new User().generateAuthToken();

      const newPost = new Post({
        userId: '63eab8bffe4d5574c301ade6',
        firstName: 'Qiqi',
        lastName: 'Liang',
        location: 'NY',
        description: 'post 1 - this is for jest test getFeed',
      });
      await newPost.save();
      const res = await request(server)
        .get(`/posts/${newPost.userId}/posts`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(
        res.body.some(
          (post) =>
            post.description === 'post 1 - this is for jest test getFeed'
        )
      ).toBeTruthy();
    });
    it('should return 404 if the given userId is invalid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .get(`/posts/${new mongoose.Types.ObjectId()}/posts`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
