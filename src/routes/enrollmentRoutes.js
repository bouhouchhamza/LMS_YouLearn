import express from 'express';
import {enroll , cancelEnroll} from '../controllers/enrollmentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:courseId/enroll', authMiddleware, enroll)
router.delete('/:courseId/enroll', authMiddleware, cancelEnroll);
export default router;