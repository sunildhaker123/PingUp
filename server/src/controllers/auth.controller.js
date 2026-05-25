import { StatusCodes } from 'http-status-codes';
import { loginUser, registerUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: { user: req.user },
  });
});
