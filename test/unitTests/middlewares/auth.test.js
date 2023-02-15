const { User } = require('../../../models/User');
const dotenv = require('dotenv');
dotenv.config();

const {
  verifyTokenMiddleware,
} = require('../../../middlewares/authorizationMiddleware');
describe('Middleware / auth', () => {
  it('should return req.user if there is a valid token', () => {
    const token = new User({ email: 'aaa@gmail.com' }).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    verifyTokenMiddleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject({ email: 'aaa@gmail.com' });
  });
});
