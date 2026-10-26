import express from 'express';
import
{
createQuiz,
getQuizByModuleId,
submitQuiz,
updateQuiz
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
router.post("/modules/:moduleId/quizzes/answer", authMiddleware,submitQuiz);
router.patch("/modules/:moduleId/quizzes/update",authMiddleware,updateQuiz);

export default router;