// const express = require("express");
import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  publishCourse,
  unPublishCourse
} from "../controllers/courseController.js";
import  {getCourseModules, createModule } from "../controllers/moduleController.js";
import  {authMiddlware}  from '../middlewares/authMiddleware.js';


const router = express.Router();
router.get("/", getCourses);
router.post("/", authMiddlware,createCourse);
router.patch("/:id", authMiddlware, updateCourse);
router.patch("/:id/unpublish",authMiddlware, unPublishCourse);
router.patch("/:id/publish",authMiddlware, publishCourse);
router.post("/:courseId/modules",authMiddlware, createModule)
} from "../controllers/courseController.js";
import getCourseModules from "../controllers/moduleController.js";
import { authMiddlware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();
router.get("/", getCourses);
router.post("/", authMiddlware, authorize("trainer", "admin"), createCourse);
router.patch(
  "/:id",
  authMiddlware,
  authorize("trainer", "admin"),
  updateCourse,
);
router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);
// module.exports = router;
export default router;
