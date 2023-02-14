import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: '',
    },
    friends: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

//在这里generate auth token, 不然all over the place
//JWT_SECRET：Node101
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      email: this.email,
    },
    process.env.JWT_SECRET
  );
  return token;
};

export const userValidation = (object) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().required(),
    password: Joi.string().min(5).required(),
    picturePath: Joi.string(),
    friends: Joi.array(),
    location: Joi.string().min(1).required(),
    occupation: Joi.string().min(1).required(),
  });
  const valiResult = schema.validate(object);
  return valiResult;
};

const User = mongoose.model('User', UserSchema);
export default User;
// module.exports.User = User;
