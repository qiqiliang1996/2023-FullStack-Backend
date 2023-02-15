const express = require('express');
const {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} = require('../controllers/post');

const {
  verifyTokenMiddleware,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router.get('/', verifyTokenMiddleware, getFeedPosts);

router.get('/:userId/posts', verifyTokenMiddleware, getUserPosts);

router.patch('/:postId/like', verifyTokenMiddleware, likePost);
router.delete('/:postId/delete', verifyTokenMiddleware, deletePost);

module.exports = router;
