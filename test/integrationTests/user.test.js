const { MongoClient } = require('mongodb');
import server from '../../index.js';

console.log('server', server);

// console.log('11 globalThis.__MONGO_URI__', globalThis.__MONGO_URI__);
// console.log('22 globalThis.__MONGO_DB_NAME__', globalThis.__MONGO_DB_NAME__);

// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db(globalThis.__MONGO_DB_NAME__);
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');

//     const mockUser = { _id: 'some-user-id', name: 'John' };
//     await users.insertOne(mockUser);

//     const insertedUser = await users.findOne({ _id: 'some-user-id' });
//     expect(insertedUser).toEqual(mockUser);
//   });
// });

// import server from '../../index';
// import request from 'supertest';

// describe('/users', () => {
//   beforeAll(() => {
//     server = server;
//   });
//   afterAll(() => {
//     server.close();
//   });

//   describe('GET /', () => {
//     it('should return all users', async () => {
//       const res = await request(server).get('/posts');
//       expect(res.status).toBe(200);
//     });
//   });

// });