import express from "express";

import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  publishCourse,
  unPublishCourse
} from "../controllers/courseController.js";

import {
  getCourseModules,
  createModule
} from "../controllers/moduleController.js";

import { authMiddlware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", getCourses);

router.post(
  "/",
  authMiddlware,
  authorize("trainer", "admin"),
  createCourse
);

router.patch(
  "/:id",
  authMiddlware,
  authorize("trainer", "admin"),
  updateCourse
);

router.patch(
  "/:id/unpublish",
  authMiddlware,
  authorize("trainer", "admin"),
  unPublishCourse
);

router.patch(
  "/:id/publish",
  authMiddlware,
  authorize("trainer", "admin"),
  publishCourse
);

router.post(
  "/:courseId/modules",
  authMiddlware,
  authorize("trainer", "admin"),
  createModule
);

router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);

export default router;