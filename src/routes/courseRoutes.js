const express = require("express");

const {
  getCourses,
  getCourseById,
} = require("../controllers/courseController");
const { getCourseModules } = require("../controllers/moduleController");
const router = express.Router();
router.get("/", getCourses);
router.get("/:courseId/modules", getCourseModules);
router.get("/:id", getCourseById);
module.exports = router;
