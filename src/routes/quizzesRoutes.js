import express from 'express';
import 
{ 
createQuiz,
getQuizByModuleId
} from '../controllers/QuizController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();


router.get("/modules/:moduleId/quizzes", authMiddleware,getQuizByModuleId);
router.post(
    "/modules/:moduleId/quizzes",
    authMiddleware,
    authorize("trainer", "admin"),
    createQuiz
);


export default router;