import mongoose from "mongoose";
import Resource from "../models/Resource.js";
import Module from "../models/Module.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import ResourceProgress from "../models/ResourceProgress.js";

export const checkResourceAccess = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }
    const module = await Module.findById(resource.module);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }
    const course = await Course.findById(module.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const enrollment = await Enrollment.findOne({
      learner: req.user._id,
      courseId: course._id,
      status: true,
    });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this enrollemnt",
      });
    }
    const previousModels = await Module.find({
      course: course._id,
      order: { $lt: module.order },
    });
    const previousResources = [];
    for (const previousModele of previousModels) {
      const resources = await Resource.find({
        module: previousModele._id,
      });
      previousResources.push(...resources);
    }
    const resourceIds = previousResources.map((resource) => resource._id);
    const completedCount = await ResourceProgress.countDocuments({
      enrollment: enrollment._id,
      resource: { $in: resourceIds },
    });
    if (completedCount < previousResources.length) {
      return res.status(403).json({
        success: false,
        message: "Previous modules are not completed",
      });
    }
    req.resource = resource;
    next();
  } catch (error) {
    next(error);
  }
};
