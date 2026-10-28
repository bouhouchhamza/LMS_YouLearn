import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import
{
createFeedback,
getFeedback
} from "../controllers/FeedbackCntroller.js";

const router = express.Router();


router.post(
    "/courses/:courseId/learners/:learnerId",
    authMiddleware,
    authorize("trainer", "admin"),
    createFeedback
);

router.get("/courses/:courseId/learners/:learnerId",
    authMiddleware,
    authorize("trainer", "admin"),
    getFeedback
);

router.get(
    "/courses/:courseId/feedback",
    authMiddleware,
    getFeedback
);




export default router;