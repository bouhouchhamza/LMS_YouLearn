import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import
{
createFeedback
} from "../controllers/FeedbackCntroller.js";

const router = express.Router();


router.post(
    "/courses/:courseId/learners/:learnerId",
    authMiddleware,
    authorize("trainer", "admin"),
    createFeedback
);

export default router;