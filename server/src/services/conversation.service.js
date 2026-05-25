import { StatusCodes } from 'http-status-codes';
import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const getDirectParticipantHash = (userIds) => userIds.map((userId) => userId.toString()).sort().join(':');

const formatLastMessage = (lastMessage) => {
  if (!lastMessage?.sentAt) {
    return {
      body: '',
      sentAt: null,
      type: 'text',
    };
  }

  return {
    id: lastMessage.message,
    senderId: lastMessage.sender,
    body: lastMessage.body,
    type: lastMessage.type,
    sentAt: lastMessage.sentAt,
  };
};

export const formatConversation = (conversation, currentUserId) => {
  const activeParticipants = conversation.participants.filter((participant) => !participant.leftAt);
  const otherParticipant = activeParticipants.find(
    (participant) => participant.user._id.toString() !== currentUserId.toString()
  );
  const isDirect = conversation.type === 'direct';

  return {
    id: conversation._id,
    type: conversation.type,
    name: isDirect ? otherParticipant?.user.name || 'Unknown user' : conversation.name,
    avatarUrl: isDirect ? otherParticipant?.user.avatarUrl || '' : conversation.avatarUrl,
    participants: activeParticipants.map((participant) => ({
      id: participant.user._id,
      name: participant.user.name,
      email: participant.user.email,
      avatarUrl: participant.user.avatarUrl,
      isOnline: participant.user.isOnline,
      role: participant.role,
    })),
    lastMessage: formatLastMessage(conversation.lastMessage),
    updatedAt: conversation.updatedAt,
  };
};

export const getUserConversations = async (currentUserId) => {
  const conversations = await Conversation.find({
    'participants.user': currentUserId,
    deletedAt: null,
  })
    .populate('participants.user', 'name email avatarUrl isOnline lastSeenAt')
    .sort({ updatedAt: -1 });

  return conversations.map((conversation) => formatConversation(conversation, currentUserId));
};

export const createOrGetDirectConversation = async ({ currentUserId, participantId }) => {
  if (currentUserId.toString() === participantId.toString()) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You cannot start a conversation with yourself');
  }

  const participant = await User.findById(participantId);

  if (!participant) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const participantHash = getDirectParticipantHash([currentUserId, participantId]);

  let conversation = await Conversation.findOne({ type: 'direct', participantHash });

  if (!conversation) {
    conversation = await Conversation.create({
      type: 'direct',
      participants: [{ user: currentUserId }, { user: participantId }],
      participantHash,
      createdBy: currentUserId,
    });
  }

  await conversation.populate('participants.user', 'name email avatarUrl isOnline lastSeenAt');

  return formatConversation(conversation, currentUserId);
};
