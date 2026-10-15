import express from "express";
import {
  getTrainerCourses,
  getCourseLearner,
  getLearnerProgress,
} from "../controllers/trainerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import ResourceProgress from "../models/ResourceProgress.js";
const router = express.Router();

router.get("/courses", authMiddleware, authorize("trainer"), getTrainerCourses);
router.get(
  "/courses/:courseId/learners",
  authMiddleware,
  authorize("trainer"),
  getCourseLearner,
);
router.get(
  "/courses/:courseId/learners/:learnerId/progress",
  authMiddleware,
  authorize("trainer", "admin"),
  getLearnerProgress,
);
export default router;
