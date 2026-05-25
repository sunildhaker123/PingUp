import { StatusCodes } from 'http-status-codes';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { ApiError } from '../utils/ApiError.js';

const ensureParticipant = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    'participants.user': userId,
    deletedAt: null,
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found');
  }

  return conversation;
};

export const formatMessage = (message) => ({
  id: message._id,
  conversationId: message.conversation,
  senderId: message.sender?._id || message.sender,
  senderName: message.sender?.name,
  senderAvatarUrl: message.sender?.avatarUrl,
  type: message.type,
  body: message.body,
  attachments: message.attachments,
  createdAt: message.createdAt,
  editedAt: message.editedAt,
});

export const getConversationMessages = async ({ conversationId, currentUserId }) => {
  await ensureParticipant(conversationId, currentUserId);

  const messages = await Message.find({
    conversation: conversationId,
    deletedAt: null,
    deletedFor: { $ne: currentUserId },
  })
    .populate('sender', 'name avatarUrl')
    .sort({ createdAt: 1 })
    .limit(100);

  return messages.map(formatMessage);
};

export const createMessage = async ({ conversationId, senderId, body, attachments = [] }) => {
  const conversation = await ensureParticipant(conversationId, senderId);

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    type: attachments.length > 0 ? attachments[0].type : 'text',
    body,
    attachments,
    receipts: conversation.participants
      .filter((participant) => participant.user.toString() !== senderId.toString())
      .map((participant) => ({ user: participant.user })),
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: {
      message: message._id,
      sender: senderId,
      body: body || (attachments.length > 0 ? 'Attachment' : ''),
      type: message.type,
      sentAt: message.createdAt,
    },
    updatedAt: new Date(),
  });

  await message.populate('sender', 'name avatarUrl');

  return formatMessage(message);
};
