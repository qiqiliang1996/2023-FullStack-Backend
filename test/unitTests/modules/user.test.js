const { User } = require('../../../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

describe('user.AuthToken', () => {
  it('should return valid token', () => {
    const user = new User({ email: 'aaa@gmail.com' });
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ email: 'aaa@gmail.com' });
  });
});
