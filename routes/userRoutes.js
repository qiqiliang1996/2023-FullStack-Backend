const express = require('express');
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
} = require('../controllers/user');
const {
  verifyTokenMiddleware,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router.get('/:id', verifyTokenMiddleware, getUser);
router.get('/:id/friends', verifyTokenMiddleware, getUserFriends);

router.patch('/:id/:friendId', verifyTokenMiddleware, addRemoveFriend);

module.exports = router;
