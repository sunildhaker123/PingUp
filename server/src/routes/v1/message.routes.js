import { Router } from 'express';
import { listMessages } from '../../controllers/message.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/:conversationId', authenticate, listMessages);

export default router;
