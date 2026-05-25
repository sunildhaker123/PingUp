import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken } from '../utils/token.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email is already registered');
  }

  const user = await User.create({ name, email, password });
  const token = generateAccessToken(user._id);

  return {
    token,
    user: user.toAuthJSON(),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const token = generateAccessToken(user._id);

  return {
    token,
    user: user.toAuthJSON(),
  };
};
