import express from 'express';
import {enroll , cancelEnroll} from '../controllers/enrollmentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.post('/:courseId/enroll', authMiddleware, authorize("learner"), enroll)
router.delete('/:courseId/enroll', authMiddleware, authorize("learner"), cancelEnroll);
export default router;
