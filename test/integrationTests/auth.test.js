let server;
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Post } = require('../../models/Post');
const { User } = require('../../models/User');
const dotenv = require('dotenv');
dotenv.config();

describe('AUTH endpoint', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Post.remove({});
    await User.remove({}); //remove everything after you insertMany
  });

  describe('Register /auth/register', () => {
    it('should return 201 if the user object can pass joi validation & no email has not been used', async () => {
      const response = await request(server).post('/auth/register').send({
        email: 'zzz2@gmail.com',
        password: '12345678',
        firstName: 'Chubb1y',
        lastName: 'Liang1',
        location: 'New York, CA',
        occupation: 'Degenerate',
      });
      //   console.log('111111 response ', response);
      expect(response.status).toBe(201);
    });
  });

  describe('Login /auth/login', () => {
    it('should return 400 if the user object can not pass joi validation', async () => {
      const response = await request(server).post('/auth/login').send({
        email: 'zzz2@gmail.com',
        password: '12',
      });
      //   console.log('111111 response ', response);
      expect(response.status).toBe(400);
    });

    it('should return 400 if the given email is not registed', async () => {
      const response = await request(server).post('/auth/login').send({
        email: 'hello@gmail.com',
        password: '123456',
      });
      //   console.log('111111 response ', response);
      expect(response.status).toBe(400);
    });

    it('should return 400 if the given password is not match', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: 'rrr@gmail.com',
        password: '123456',
        firstName: 'Chubby',
        lastName: 'Liang',
        location: 'New York, CA',
        occupation: 'Degenerate',
      };

      // console.log('11!!!!!! user', user);

      const newUser = new User(user);
      await newUser.save();

      const response = await request(server).post('/auth/login').send({
        email: 'rrr@gmail.com',
        password: '123234567',
      });
      //   console.log('111111 response ', response);
      expect(response.status).toBe(400);
    });

    it('should return 200 if the given email and password is match', async () => {
      let password = '123456';
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      await User.insertMany([
        {
          email: 'vvv@gmail.com',
          password: passwordHash,
          firstName: 'Chubby',
          lastName: 'Liang',
          location: 'New York, CA',
          occupation: 'Degenerate',
        },
      ]);

      const response = await request(server).post('/auth/login').send({
        email: 'vvv@gmail.com',
        password: '123456',
      });
      //   console.log('hihi response ', response);
      expect(response.status).toBe(200);
    });
  });
});
