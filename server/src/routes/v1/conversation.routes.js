import { Router } from 'express';
import {
  createDirectConversation,
  listConversations,
} from '../../controllers/conversation.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createDirectConversationValidation } from '../../validations/conversation.validation.js';

const router = Router();

router.get('/', authenticate, listConversations);
router.post('/direct', authenticate, createDirectConversationValidation, validate, createDirectConversation);

export default router;
