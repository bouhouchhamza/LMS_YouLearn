// const express = require("express");
import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  publishCourse,
  unPublishCourse
} from "../controllers/courseController.js";
import getCourseModules from "../controllers/moduleController.js";
import  {authMiddlware}  from '../middlewares/authMiddleware.js';


const router = express.Router();
router.get("/", getCourses);
router.post("/", authMiddlware,createCourse);
router.patch("/:id", authMiddlware, updateCourse);
router.patch("/:id/unpublish",authMiddlware, unPublishCourse);
router.patch("/:id/publish",authMiddlware, publishCourse);
router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);
// module.exports = router;
export default router;
