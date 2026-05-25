import { body } from 'express-validator';

export const createDirectConversationValidation = [
  body('participantId').isMongoId().withMessage('A valid participantId is required'),
];
