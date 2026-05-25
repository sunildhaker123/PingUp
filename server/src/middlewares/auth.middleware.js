import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/token.js';

const extractBearerToken = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication token is required');
  }

  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub).select('-password');

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authenticated user no longer exists');
  }

  req.user = user;
  next();
});
