const User = require('../models/userModels');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

const signup = async (req, res) => {
  const { email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  const user = await User.create({ email, password });

  attachCookiesToResponse({ res, user: { id: user.id, email: user.email }  });
  res.status(StatusCodes.CREATED).json({ user: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials Email');
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials Password');
  }
  console.log(user)
  attachCookiesToResponse({ res, user: { id: user.id, email: user.email } });
  res.status(StatusCodes.OK).json({ user: user });
};

module.exports = {
  login,
  signup,
}