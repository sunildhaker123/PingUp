import { StatusCodes } from 'http-status-codes';
import { searchUsers } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const search = asyncHandler(async (req, res) => {
  const users = await searchUsers({
    query: req.query.q || '',
    currentUserId: req.user._id,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: { users },
  });
});
