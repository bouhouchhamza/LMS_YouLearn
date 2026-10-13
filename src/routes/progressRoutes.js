import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { completeResource } from '../controllers/progressController.js';

const router = express.Router();

router.post('/:resourceId/complete', authMiddleware, authorize("learner"),completeResource);
export default router;