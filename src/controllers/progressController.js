import ResourceProgress from "../models/ResourceProgress.js";
import Enrollment from "../models/Enrollment.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import mongoose from "mongoose";

export const completeResource = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource Id",
      });
    }
    const resource = await Resource.findById(resourceId);
    if (resource === null) {
      return res.status(404).json({
        success: false,
        message: "Resource not Found",
      });
    }
    const modul = await Module.findById(resource.module);

    if (modul === null) {
      return res.status(404).json({
        success: false,
        message: "Module not Found",
      });
    }
    const enrollmnt = await Enrollment.findOne({
      learner: req.user._id,
      courseId: modul.course,
      status: true,
    });
    if (enrollmnt === null) {
      return res.status(403).json({
        success: false,
        message: "Enrollment is not active",
      });
    }
    // const module = await Module.find({module:modul._id});
    const previousModules = await Module.find({
      course: modul.course,
      order: { $lt: modul.order },
    });
    for (const module of previousModules) {
      const resources = await Resource.find({ module: module._id });
      const resourcesIds = resources.map((resource) => resource._id);
      const resourceProgresseCount = await ResourceProgress.countDocuments({
        enrollment: enrollmnt._id,
        resource: { $in: resourcesIds },
      });
      if (resourceProgresseCount < resources.length) {
        return res.status(403).json({
          success: false,
          message: "you have a previous module didn't finish",
        });
      }
    }
    const resourceProgesse = await ResourceProgress.findOneAndUpdate(
      { enrollment: enrollmnt._id, resource: resource._id },
      { $setOnInsert: { completedAt: new Date() } },
      { upsert: true, new: true, includeResultMetadata: true },
    );
    const allModules = await Module.find({
      course: modul.course,
    });
    const moduleIds = allModules.map((module) => module._id);

    const allResources = await Resource.find({
      module: { $in: moduleIds },
    });
    const resourceIds = allResources.map((resource) => resource._id);
    const completedCount = await ResourceProgress.countDocuments({
      enrollment: enrollmnt._id,
      resource: { $in: resourceIds },
    });
    const percentage =
      allResources.length > 0
        ? Number(((completedCount / allResources.length) * 100).toFixed(2))
        : 0;
    enrollmnt.progress = percentage;
    await enrollmnt.save();
    const statusCode = resourceProgesse.lastErrorObject.updatedExisting
      ? 200
      : 201;
    return res.status(statusCode).json({
      success: true,
      message: "Resource completed successfully",
      data: resourceProgesse.value,
      progress: percentage,
    });
  } catch (error) {
    console.log("Complete Resource Error: ", error);
    next(error);
  }
};
export const resumeLearning = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }
    const enrollment = await Enrollment.findOne({
      learner: req.user._id,
      courseId: courseId,
      status: true,
    });
    if (!enrollment) {
      return res.status(403).json({
        message: "Enrollement is not active",
      });
    }
    const modules = await Module.find({
      course: courseId,
    }).sort({ order: 1 });
    const orderedResources = [];
    for (const module of modules) {
      const resources = await Resource.find({
        module: module._id,
      }).sort({ order: 1 });
      orderedResources.push(...resources);
    }
    const completedResources = await ResourceProgress.find({
      enrollment: enrollment._id,
    });
    const nextResource = orderedResources.find((resource) => {
      return !completedResources.some((complete) =>
        complete.resource.equals(resource._id),
      );
    });
    if(nextResource === undefined){
    return res.status(200).json({
      success: true,
      progress: enrollment.progress,
      nextresource: null,
    });
    }
    const {_id,title,type,module,order}=nextResource;
    const safeResource = {
        _id,
        title,
        type,
        module,
        order
    }
    return res.status(200).json({
      success: true,
      progress: enrollment.progress,
      nextresource: safeResource,
    });
  } catch (error) {
    next(error);
  }
};
