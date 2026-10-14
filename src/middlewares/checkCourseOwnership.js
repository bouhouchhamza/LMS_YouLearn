import mongoose from "mongoose";
import Course from "../models/Course.js";
import Module from "../models/Module.js";

function checkCourseOwnership(source) {
  return async (req, res, next) => {
    try {
      if (source !== "course" && source !== "module") {
        return res.status(400).json({
          success: false,
          message: "check source no valid",
        });
      }
      let course;
      if (source === "course") {
        const id = req.params.id || req.params.courseId;
        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid Course Id",
          });
        }

        course = await Course.findById(id);
        if (!course) {
          return res.status(404).json({
            success: false,
            message: "can not found course",
          });
        }
      }
      if (source === "module") {
        const moduleId = req.params.moduleId;
        if (!mongoose.isValidObjectId(moduleId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid Module Id",
          });
        }

        const module = await Module.findById(moduleId);
        if (!module) {
          return res.status(404).json({
            success: false,
            message: "can not found module",
          });
        }
        course = await Course.findById(module.course);
        if (!course) {
          return res.status(404).json({
            success: false,
            message: "can not found course",
          });
        }
      }

      const trainerId = req.user._id;

      if (
        req.user.role !== "admin" &&
        String(trainerId) !== String(course.trainer)
      ) {
        return res.status(403).json({
          success: false,
          message: "this course is not for you",
        });
      }

      req.course =course;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default checkCourseOwnership;