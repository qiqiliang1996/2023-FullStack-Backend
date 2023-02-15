let server;
const request = require('supertest');
const mongoose = require('mongoose');

const { Post } = require('../../models/Post');
const { User } = require('../../models/User');
const dotenv = require('dotenv');
dotenv.config();

describe('POSTs endpoint', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Post.remove({});
    await User.remove({}); //remove everything after you insertMany
  });

  describe('GET /post', () => {
    // it('should return 401 if user did not log in', async () => {
    //   const response = await request(server)
    //     .get('/posts')
    //     .send({ description: '/post - post description: user did not log in' });
    //   // console.log('-00 response', response);
    //   expect(response.status).toBe(401);
    // });

    it('should return all posts', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: 'aaa@gmail.com',
      };
      const token = new User(user).generateAuthToken();

      // console.log('11111 user??', user);

      await Post.insertMany([
        {
          userId: user._id,
          firstName: 'Qiqi',
          lastName: 'Liang',
          description: 'this is for jest test getFeed',
        },
      ]);
      // const token = new User().generateAuthToken();
      const res = await request(server)
        .get('/posts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((post) => post.userId === user._id)).toBeTruthy();
    });
  });

  describe('GET /:userId/posts', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server).get(
        `/posts/${new mongoose.Types.ObjectId()}/posts`
      );

      expect(response.status).toBe(401);
    });
    //
    it('should return all posts from a given userId', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: 'lll@gmail.com',
        password: '12345678',
        firstName: 'Chubby',
        lastName: 'Liang',
        location: 'New York, CA',
        occupation: 'Degenerate',
      };

      // console.log('11!!!!!! user', user);

      const newUser = new User(user);
      await newUser.save();
      const token = new User(user).generateAuthToken();

      const newPost = new Post({
        userId: user._id,
        firstName: 'Qiqi',
        lastName: 'Liang',
        location: 'NY',
        description: 'post 1 - this is for jest test getFeed',
      });
      await newPost.save();
      const res = await request(server)
        .get(`/posts/${user._id}/posts`)
        .set('Authorization', `Bearer ${token}`);

      // console.log('222 res!!,', res);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(
        res.body.some(
          (post) =>
            post.description === 'post 1 - this is for jest test getFeed'
        )
      ).toBeTruthy();
    });
    //
    it('should return 404 if the given userId is invalid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .get(`/posts/${new mongoose.Types.ObjectId()}/posts`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /post', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server).post('/posts');
      expect(response.status).toBe(401);
    });

    it('should return 400 if the given userId is not found', async () => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: new mongoose.Types.ObjectId() });

      expect(response.status).toBe(400);
    });

    it('should return 201 if userId is valid', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: 'hhh@gmail.com',
        password: '1234567890',
        firstName: 'Chubby1',
        lastName: 'Liang1',
        location: 'New York, CA',
        occupation: 'Degenerate',
      };

      // console.log('11!!!!!! user', user);

      const newUser1 = new User(user);
      await newUser1.save();

      const token = new User(user).generateAuthToken();

      const response = await request(server)
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: user._id,
          description: 'jest test for POST /post',
        });
      // console.log('123456 response', response);
      expect(response.status).toBe(201);
    });
  });

  describe('Patch /:postId/like ', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server).patch(
        `/posts/${new mongoose.Types.ObjectId()}/like`
      );
      expect(response.status).toBe(401);
    });
    it('should return 400 if the given postId is not found', async () => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .patch(`/posts/${new mongoose.Types.ObjectId()}/like`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
    it('should update the post to be liked if the given user has not like this post yet', async () => {
      const token = new User().generateAuthToken();
      const post = new Post({
        userId: '63eab8bffe4d5574c301ade6',
        firstName: 'Qiqi',
        lastName: 'Liang',
        location: 'NY',
        likes: {},
        description: 'post 1 - this is for jest test liked a post',
      });
      await post.save();

      const response = await request(server)
        .patch(`/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: '63eab8bffe4d5574c301ade6',
        });

      // console.log(response.body.likes);

      expect(response.status).toBe(200);
      expect(response.body.likes).toHaveProperty('63eab8bffe4d5574c301ade6');
    });
    it('should update the post to be unliked if the given user has been liked this post', async () => {
      const token = new User().generateAuthToken();
      const post = new Post({
        userId: '63eab8bffe4d5574c301ade6',
        firstName: 'Qiqi',
        lastName: 'Liang',
        location: 'NY',
        likes: { '63eab8bffe4d5574c301ade6': true },
        description: 'post 1 - this is for jest test liked a post',
      });
      await post.save();

      const response = await request(server)
        .patch(`/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: '63eab8bffe4d5574c301ade6',
        });

      // console.log(response.body.likes);

      expect(response.status).toBe(200);
      expect(response.body.likes).not.toHaveProperty(
        '63eab8bffe4d5574c301ade6'
      );
    });
  });

  describe('DELETE /:postId/delete ', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server).delete(
        `/posts/${new mongoose.Types.ObjectId()}/delete`
      );
      expect(response.status).toBe(401);
    });

    it('should return 400 if the given postId is not found', async () => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .delete(`/posts/${new mongoose.Types.ObjectId()}/delete`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });

    it('should return 200 if the given postId is valid', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test10@gmail.com',
        password: '123456',
        firstName: 'Chubby',
        lastName: 'Liang',
        location: 'New York, CA',
        occupation: 'Degenerate',
      };

      // console.log('11!!!!!! user', user);

      const newUser = new User(user);
      await newUser.save();

      const token = new User().generateAuthToken();

      const newPost = new Post({
        userId: user._id,
        firstName: 'Chubby',
        lastName: 'Liang',
        location: 'NY',
        description: 'post 1 - this is for jest test deletePost',
      });
      await newPost.save();

      const res = await request(server)
        .delete(`/posts/${newPost._id}/delete`)
        .set('Authorization', `Bearer ${token}`);
      // console.log('11111 res', res);

      expect(res.status).toBe(200);
      expect(res.body.deletedPost).not.toBeNull();
    });
  });
});
