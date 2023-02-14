import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('user.AuthToken', () => {
  it('should return valid token', () => {
    const user = new User({ email: 'aaa@gmail.com' });
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ email: 'aaa@gmail.com' });
  });
});
