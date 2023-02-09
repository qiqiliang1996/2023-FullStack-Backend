import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} from '../controllers/post.js';
import { verifyTokenMiddleware } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/', verifyTokenMiddleware, getFeedPosts);
router.get('/:userId/posts', verifyTokenMiddleware, getUserPosts);
router.patch('/:postId/like', verifyTokenMiddleware, likePost);
router.delete('/:postId/delete', verifyTokenMiddleware, deletePost);

export default router;
