const { Post } = require('../models/Post');
const { User } = require('../models/User');
const mongoose = require('mongoose');

const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ error: { message: 'User not found' } });

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(posts);
  } catch (error) {
    console.log('createPost error', error);
    res.status(500).json({ error: { message: error.message } });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(409).json({ error: { message: error.message } });
  }
};

const getUserPosts = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ error: { message: 'User not found' } });

  try {
    const posts = await Post.find({ userId });

    res.status(200).json(posts);
  } catch (error) {
    res.status(409).json({ error: { message: error.message } });
  }
};

const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);

    if (!post)
      return res.status(404).json({ error: { message: 'Post not found' } });

    const isLike = post.likes.get(userId); //mongodb Map.get()
    if (isLike) {
      post.likes.delete(userId); //mongodb Map.delete()
    } else {
      post.likes.set(userId, true); //mongodb Map.set()
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ error: { message: error.message } });
  }
};

const deletePost = async (req, res) => {
  console.log('1 backend called');
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    console.log('2 backend deletedPost,', deletedPost);

    if (!deletedPost) {
      res.status(404).send('sorry, genre with the given id is not found');
      return;
    }
    const allPostsAfterDeletion = await Post.find().sort({ createdAt: -1 });
    console.log('3 backend allPostsAfterDeletion,', allPostsAfterDeletion);

    res.status(200).json({ deletedPost, allPostsAfterDeletion });
  } catch (error) {
    res.status(409).json({ error: { message: error.message } });
  }
};

module.exports.createPost = createPost;
module.exports.getFeedPosts = getFeedPosts;
module.exports.getUserPosts = getUserPosts;
module.exports.likePost = likePost;
module.exports.deletePost = deletePost;
