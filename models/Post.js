const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    }, //Map of userId, the value is always be true, if user unlike it, remove the userId from the map
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
const Post = mongoose.model('Post', PostSchema);
module.exports.Post = Post;
