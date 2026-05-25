import { StatusCodes } from 'http-status-codes';
import {
  createOrGetDirectConversation,
  getUserConversations,
} from '../services/conversation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await getUserConversations(req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: { conversations },
  });
});

export const createDirectConversation = asyncHandler(async (req, res) => {
  const conversation = await createOrGetDirectConversation({
    currentUserId: req.user._id,
    participantId: req.body.participantId,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: { conversation },
  });
});
