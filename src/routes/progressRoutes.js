import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import {
  completeResource,
  resumeLearning,
} from "../controllers/progressController.js";
import {
  getResourceContent,
  downloadResource,
} from "../controllers/resourceController.js";
import { checkResourceAccess } from "../middlewares/checkResourceAccess.js";
const resourceProgressRouter = express.Router();
const courseProgressRouter = express.Router();

resourceProgressRouter.post(
  "/:resourceId/complete",
  authMiddleware,
  authorize("learner"),
  completeResource,
);
courseProgressRouter.get(
  "/:courseId/resume",
  authMiddleware,
  authorize("learner"),
  resumeLearning,
);
resourceProgressRouter.get(
  "/:resourceId/content",
  authMiddleware,
  authorize("learner"),
  checkResourceAccess,
  getResourceContent,
);
resourceProgressRouter.get(
  "/:resourceId/download",
  authMiddleware,
  authorize("learner"),
  checkResourceAccess,
  downloadResource,
);
export { resourceProgressRouter, courseProgressRouter };
