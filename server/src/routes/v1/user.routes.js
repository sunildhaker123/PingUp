import { Router } from 'express';
import { search } from '../../controllers/user.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', authenticate, search);

export default router;
