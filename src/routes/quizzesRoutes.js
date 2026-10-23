import express from 'express';
import { createQuiz} from '../controllers/QuizController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();



router.post(
    "/modules/:moduleId/quizzes",
    authMiddleware,
    authorize("trainer", "admin"),
    createQuiz
);


export default router;