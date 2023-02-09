import jwt from 'jsonwebtoken';

export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      res.status(401).json({ message: 'Access Denied' });
      return;
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.user = decoded; //重点
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
