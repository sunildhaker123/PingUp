import mongoose from 'mongoose';

const { Schema } = mongoose;

const conversationTypes = ['direct', 'group'];
const participantRoles = ['member', 'admin', 'owner'];

const participantSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: participantRoles,
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
      default: null,
    },
    lastReadMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastReadAt: {
      type: Date,
      default: null,
    },
    mutedUntil: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const lastMessageSchema = new Schema(
  {
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    body: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file', 'system'],
      default: 'text',
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const conversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: conversationTypes,
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    participants: {
      type: [participantSchema],
      required: true,
      default: [],
      validate: {
        validator(participants) {
          const uniqueParticipants = new Set(
            participants.map((participant) => participant.user.toString())
          );

          if (this.type === 'direct') {
            return participants.length === 2 && uniqueParticipants.size === 2;
          }

          return participants.length >= 2 && uniqueParticipants.size === participants.length;
        },
        message:
          'Direct chats require exactly 2 participants; groups require at least 2 unique participants',
      },
    },
    participantHash: {
      type: String,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: lastMessageSchema,
      default: () => ({}),
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

conversationSchema.pre('validate', function setDirectParticipantHash(next) {
  if (this.type === 'direct' && this.participants?.length === 2) {
    this.participantHash = this.participants
      .map((participant) => participant.user.toString())
      .sort()
      .join(':');
  }

  next();
});

conversationSchema.index({ 'participants.user': 1, updatedAt: -1 });
conversationSchema.index({ participantHash: 1 }, { unique: true, sparse: true });
conversationSchema.index({ type: 1, updatedAt: -1 });
conversationSchema.index({ name: 'text', description: 'text' });

export const Conversation = mongoose.model('Conversation', conversationSchema);
