import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from '../controllers/user.js';
import { verifyTokenMiddleware } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/:id', verifyTokenMiddleware, getUser);
router.get('/:id/friends', verifyTokenMiddleware, getUserFriends);

router.patch('/:id/:friendId', verifyTokenMiddleware, addRemoveFriend);

export default router;
