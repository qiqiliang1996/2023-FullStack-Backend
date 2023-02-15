let server;
const request = require('supertest');
const mongoose = require('mongoose');

const { Post } = require('../../models/Post');
const { User } = require('../../models/User');
const dotenv = require('dotenv');
dotenv.config();

describe('USER endpoint', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Post.remove({});
    await User.remove({}); //remove everything after you insertMany
  });

  describe('GET /users/:id', () => {
    // it('should return 401 if user did not log in', async () => {
    //   const response = await request(server)
    //     .get(`/users/${new mongoose.Types.ObjectId()}`)
    //     .send({ description: '/post - post description: user did not log in' });
    //   expect(response.status).toBe(401);
    // });

    it('should return 404 if given userId is not found', async () => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .get(`/users/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: '/post - post description: user did not log in' });
      expect(response.status).toBe(404);
    });

    it('should return 200 if given userId is valid', async () => {
      const user = {
        // _id: new mongoose.Types.ObjectId().toHexString(),
        email: 'kkk@gmail.com',
        password: '12345678',
        firstName: 'Chubby',
        lastName: 'Liang',
        location: 'New York, CA',
        occupation: 'Degenerate',
      };

      // console.log('11!!!!!! user', user);

      const newUser = new User(user);
      await newUser.save();
      const token = new User().generateAuthToken();

      const response = await request(server)
        .get(`/users/${newUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: '/post - post description: user did not log in' });
      //   console.log('11!!!!!! response', response);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /users/:id/friends', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server)
        .get(`/users/${new mongoose.Types.ObjectId()}`)
        .send({ description: '/post - post description: user did not log in' });
      expect(response.status).toBe(401);
    });

    it('should return 200 if given userId is valid', async () => {
      const token = new User().generateAuthToken();

      const userIds = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ];

      User.insertMany([
        {
          _id: userIds[0],
          firstName: 'test',
          lastName: 'me',
          email: 'aaaaaaa@gmail.com',
          password: '$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy',
          friends: [`${userIds[1].toHexString()}`],
          location: 'San Fran, CA',
          occupation: 'Software Engineer',
        },
        {
          _id: userIds[1],
          firstName: 'test',
          lastName: 'me',
          email: 'bb@gmail.com',
          password: '$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy',
          friends: [`${userIds[0].toHexString()}`],
          location: 'San Fran, CA',
          occupation: 'Software Engineer',
        },
      ]);

      const response = await request(server)
        .get(`/users/${userIds[0]}/friends`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: '/post - post description: user did not log in' });
      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /users/:id/:friendId', () => {
    it('should return 401 if user did not log in', async () => {
      const response = await request(server)
        .patch(
          `/users/${new mongoose.Types.ObjectId()}/${new mongoose.Types.ObjectId()}`
        )
        .send({ description: '/post - post description: user did not log in' });
      expect(response.status).toBe(401);
    });

    it('should return 200 & be friend with each other if given frienId is not in user friend list', async () => {
      const token = new User().generateAuthToken();

      const userIds = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ];

      User.insertMany([
        {
          _id: userIds[0],
          firstName: 'test',
          lastName: 'me',
          email: 'aaaaaaa@gmail.com',
          password: '$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy',
          friends: [`${userIds[1].toHexString()}`],
          location: 'San Fran, CA',
          occupation: 'Software Engineer',
        },
        {
          _id: userIds[1],
          firstName: 'test2',
          lastName: 'me2',
          email: 'bb@gmail.com',
          password: '$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy',
          friends: [`${userIds[0].toHexString()}`],
          location: 'San Fran, CA',
          occupation: 'Software Engineer',
        },
      ]);

      const response = await request(server)
        .patch(`/users/${userIds[0].toHexString()}/${userIds[1].toHexString()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: '/post - post description: user did not log in' });
      expect(response.status).toBe(200);
    });

    it('should return 200 & unfriend with each other if given frienId is already in user friend list', async () => {
      const token = new User().generateAuthToken();

      const userIds = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ];

      User.insertMany([
        {
          _id: userIds[0],
          firstName: 'test',
          lastName: 'me',
          email: 'aaaaaaa@gmail.com',
          password: '$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy',
          friends: [],
          location: 'San Fran, CA',
          occupation: 'Software Engineer',
        },
        {
          _id: userIds[1],
          firstName: 'test2',
          lastName: 'me2',
          email: 'bb@gmail.com',
          password: '$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy',
          friends: [],
          location: 'San Fran, CA',
          occupation: 'Software Engineer',
        },
      ]);

      const response = await request(server)
        .patch(`/users/${userIds[0].toHexString()}/${userIds[1].toHexString()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: '/post - post description: user did not log in' });
      expect(response.status).toBe(200);
    });
  });
});
