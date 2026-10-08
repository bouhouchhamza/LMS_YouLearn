// const express = require("express");
import express from 'express';
import {
  getCourses,
  getCourseById,
} from "../controllers/courseController.js";
import getCourseModules from "../controllers/moduleController.js";
const router = express.Router();
router.get("/", getCourses);
router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);
// module.exports = router;
export default router;
