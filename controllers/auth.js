const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const { User, userValidation } = require('../models/User');

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    //step1: check the input whether or not pass the validation
    const registerUserValiResult = userValidation(req.body);
    // console.log('registerUserValiResult', registerUserValiResult);

    if (registerUserValiResult.error) {
      res
        .status(400)
        .json({ error: { message: registerUserValiResult.error.message } });
      return;
    }

    //step2: check the email whether or not has been used
    const result = await User.findOne({ email: req.body.email });
    if (result) {
      res
        .status(400)
        .json({ error: { message: 'This eamil has already been register!' } });
      return;
    }

    //step3: if all ok, we register new user
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save();
    const user = _.pick(savedUser, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'picturePath',
      'friends',
      'location',
      'occupation',
      'viewedProfile',
      'impressions',
    ]);
    const token = newUser.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

const login = async (req, res) => {
  //step1: check the login email & password whether or not pass the validation
  const loginValidation = (user) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
    });
    const result = schema.validate(user);
    return result;
  };

  const result = loginValidation(req.body);

  if (result.error) {
    res.status(400).json({
      error: { message: 'Sorry, bad request,' + result.error.message },
    });
    return;
  }

  //step2: check the login email whether or not existed
  try {
    const { email, password } = req.body;

    // console.log('lll  email, password ', email, password);
    const result = await User.findOne({ email: email });
    // console.log('kkk backend login result', result);
    if (!result) {
      res.status(400).json({
        error: {
          message: 'Sorry, email not found, please register before login.',
        },
      });
      return;
    }
    //step3: check the login password input whether or not matching the databse password
    const validPassword = await bcrypt.compare(password, result.password);
    // console.log('jjj validPassword', validPassword);
    if (!validPassword) {
      res
        .status(400)
        .json({ error: { message: 'Sorry, password is invalid' } });
      return;
    }

    const token = result.generateAuthToken();
    const user = _.pick(result, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'picturePath',
      'friends',
      'location',
      'occupation',
      'viewedProfile',
      'impressions',
    ]);
    //step4: return user & token
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

module.exports.register = register;
module.exports.login = login;
