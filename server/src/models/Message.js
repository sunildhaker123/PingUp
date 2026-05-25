import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageTypes = ['text', 'image', 'video', 'audio', 'file', 'system'];
const messageStatuses = ['sent', 'delivered', 'read'];

const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'file'],
      required: true,
    },
    fileName: {
      type: String,
      default: '',
      trim: true,
    },
    mimeType: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: Number,
      min: 0,
      default: 0,
    },
    width: {
      type: Number,
      min: 0,
      default: null,
    },
    height: {
      type: Number,
      min: 0,
      default: null,
    },
    duration: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

const receiptSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: messageTypes,
      default: 'text',
    },
    body: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    forwardedFrom: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    status: {
      type: String,
      enum: messageStatuses,
      default: 'sent',
    },
    receipts: {
      type: [receiptSchema],
      default: [],
    },
    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.path('body').validate(function validateContent(body) {
  return Boolean(body || this.attachments.length > 0 || this.type === 'system');
}, 'Message body or attachment is required');

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, _id: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ 'receipts.user': 1, 'receipts.readAt': 1 });
messageSchema.index({ body: 'text' });

export const Message = mongoose.model('Message', messageSchema);
