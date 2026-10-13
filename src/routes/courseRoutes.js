import express from "express";

import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  publishCourse,
  unPublishCourse,
} from "../controllers/courseController.js";

import {
  getCourseModules,
  createModule,
} from "../controllers/moduleController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", getCourses);

router.post("/", authMiddleware, authorize("trainer", "admin"), createCourse);

router.patch(
  "/:id",
  authMiddleware,
  authorize("trainer", "admin"),
  updateCourse,
);

router.patch(
  "/:id/unpublish",
  authMiddleware,
  authorize("trainer", "admin"),
  unPublishCourse,
);

router.patch(
  "/:id/publish",
  authMiddleware,
  authorize("trainer", "admin"),
  publishCourse,
);

router.post(
  "/:courseId/modules",
  authMiddleware,
  authorize("trainer", "admin"),
  createModule,
);

router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);

export default router;
