// const mongoose = require('mongoose');
// const Module = require('../models/Module');
// const Resource = require('../models/Resource');
import mongoose from "mongoose";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import ResourceProgress from "../models/ResourceProgress.js";

async function getModuleResources(req, res, next) {
  try {
    const { moduleId } = req.params;

    if (!mongoose.isValidObjectId(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module id",
      });
    }
    const moduleExists = await Module.findById(moduleId);

    if (!moduleExists) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }
    const resources = await Resource.find({
      module: moduleId,
    })
      .sort({
        order: 1,
      })
      .select("-url -content -filePath");
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
}

async function createResource(req, res, next) {
  try {
    const moduleId = req.params.moduleId;
    if (!mongoose.isValidObjectId(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module id",
      });
    }

    const findModule = await Module.findById(moduleId);
    if (!findModule) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const course = await Course.findById(findModule.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    // console.log(course);
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

    const { title, type, url, content, order, module } = req.body;
    const resource = new Resource({
      title,
      type,
      url,
      content,
      order,
      module: moduleId,
    });

    const saveResource = await resource.save();
    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: saveResource,
    });
  } catch (error) {
    next(error);
  }
}

async function uploadResource(req, res, next) {
  try {
    const { moduleId } = req.params;
    const { title, type, order } = req.body;
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }
    const allowedTypes = {
      pdf: "application/pdf",
      video: "video/mp4",
    };

    if (allowedTypes[type] !== file.mimetype) {
      return res.status(400).json({
        success: false,
        message: "Resource type does not match uploaded file",
      });
    }

    const resource = new Resource({
      title,
      type,
      order,
      module: moduleId,
      filePath: file.path,
    });

    const savedResource = await resource.save();

    return res.status(201).json({
      success: true,
      message: " resource uploaded successfully",
      data: savedResource,
    });
  } catch (error) {
    next(error);
  }
}
async function getResourceContent(req, res, next) {
  try {
    const { resourceId } = req.params;
    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found ",
      });
    }
    const modul = await Module.findById(resource.module);
    if (!modul) {
      return res.status(404).json({
        success: false,
        message: "Module not found ",
      });
    }
    const course = await Course.findById(modul.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found ",
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
        message: "Enrollment not found",
      });
    }
    const modules = await Module.find({
      course: course._id,
    }).sort({ order: 1 });
    const currentModule = modules.findIndex((current) =>
      current._id.equals(modul._id),
    );
    if (currentModule === -1) {
      return res.status(404).json({
        success: false,
        message: "Current model is not Found",
      });
    }
    const previousModuls = modules.slice(0, currentModule);
    const previousModulIds = previousModuls.map((modul) => modul._id);
    const resourcesModels = await Resource.find({
      module: { $in: previousModulIds },
    });
    const completedResource = await ResourceProgress.find({
      enrollment: enrollment._id,
    });
    const allPreviousCompleted = resourcesModels.every((resource) => {
      return completedResource.some((completed) => {
        return completed.resource.equals(resource._id) ;
      });
    });
    if (!allPreviousCompleted) {
      return res.status(403).json({
        success: false,
        message: "you have a previous resource not completed",
      });
    }
    const safeData = {
      _id: resource._id,
      title: resource.title,
      type: resource.type,
      url: resource.url,
      content: resource.content
    }
    return res.status(200).json({
      success: true,
      data: safeData
    })
  } catch (error) {
    next(error);
  }
}

export { getModuleResources, createResource, uploadResource, getResourceContent };
