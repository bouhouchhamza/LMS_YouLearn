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
import  {authMiddleware}  from '../middlewares/authMiddleware.js';
import { authorize } from "../middlewares/authorize.js";


const router = express.Router();
router.get("/", getCourses);
router.post("/", authMiddleware,authorize("trainer", "admin"),createCourse);
router.patch("/:id", authMiddleware,authorize("trainer", "admin"), updateCourse);
router.patch("/:id/unpublish",authMiddleware, unPublishCourse);
router.patch("/:id/publish",authMiddleware, publishCourse);
router.post("/:courseId/modules",authMiddleware, createModule)
router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);
// module.exports = router;
export default router;
