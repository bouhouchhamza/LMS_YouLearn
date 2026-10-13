// const mongoose = require('mongoose');
// const Module = require('../models/Module');
// const Resource = require('../models/Resource');
import mongoose from "mongoose";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import Course from "../models/Course.js";
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
    }).sort({
      order: 1,
    });
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

export { getModuleResources, createResource };
