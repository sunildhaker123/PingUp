import { StatusCodes } from 'http-status-codes';
import { getConversationMessages } from '../services/message.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await getConversationMessages({
    conversationId: req.params.conversationId,
    currentUserId: req.user._id,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: { messages },
  });
});
