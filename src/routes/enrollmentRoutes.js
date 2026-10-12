import express from 'express';
import {enroll , cancelEnroll} from '../controllers/enrollmentController.js';
import { authMiddlware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:courseId/enroll', authMiddlware, enroll)
router.delete('/:courseId/enroll', authMiddlware, cancelEnroll);
export default router;