// const express = require("express");
import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse
} from "../controllers/courseController.js";
import getCourseModules from "../controllers/moduleController.js";
import  {authMiddlware}  from '../middlewares/authMiddleware.js';


const router = express.Router();
router.get("/", getCourses);
router.post("/", authMiddlware,createCourse);
router.patch("/:id", authMiddlware, updateCourse);
router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);
// module.exports = router;
export default router;
