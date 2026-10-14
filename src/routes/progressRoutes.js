import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { completeResource, resumeLearning } from '../controllers/progressController.js';

const resourceProgressRouter = express.Router();
const courseProgressRouter = express.Router();

resourceProgressRouter.post('/:resourceId/complete', authMiddleware, authorize("learner"),completeResource);
courseProgressRouter.get('/:courseId/resume', authMiddleware,authorize('learner'),resumeLearning)
export { resourceProgressRouter, courseProgressRouter };