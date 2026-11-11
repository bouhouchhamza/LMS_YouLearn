import mongoose from "mongoose";
import Module from "../models/Module.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Resource from "../models/Resource.js";
import ResourceProgress from "../models/ResourceProgress.js";

// Apply the existing resource-access rules to quizzes without changing their URLs.
export const checkQuizAccess = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.moduleId)) {
      return res.status(400).json({ success: false, message: "Invalid module id" });
    }
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });
    const course = await Course.findById(module.course);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (req.user.role === "admin" ||
        (req.user.role === "trainer" && course.trainer.equals(req.user._id))) return next();
    if (req.user.role !== "learner") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const enrollment = await Enrollment.findOne({ learner: req.user._id, courseId: course._id, status: true });
    if (!enrollment) return res.status(403).json({ success: false, message: "Enrollment is not active" });
    const previousModules = await Module.find({ course: course._id, order: { $lt: module.order } });
    const resources = await Resource.find({ module: { $in: previousModules.map(item => item._id) } });
    const completed = await ResourceProgress.countDocuments({ enrollment: enrollment._id, resource: { $in: resources.map(item => item._id) } });
    if (completed < resources.length) {
      return res.status(403).json({ success: false, message: "Previous modules are not completed" });
    }
    next();
  } catch (error) { next(error); }
};
