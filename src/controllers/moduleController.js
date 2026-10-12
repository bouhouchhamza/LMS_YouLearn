// const mongoose = require('mongoose');
// const Course = require('../models/Course');
// const Module = require('../models/Module');
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
async function getCourseModules(req, res, next) {
  try {
    const { courseId } = req.params;
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }
    const course = await Course.findOne({
      _id: courseId,
      status: "published",
    });

    const modules = await Module.find({
      course: courseId,
    }).sort({
      order: 1,
    });
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error) {
    next(error);
  }
}

async function createModule(req, res, next) {
  try {
    const courseId = req.params.courseId;
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id.",
      });
    }

    const findCourse = await Course.findById(courseId);
    if (!findCourse) {
      return res.status(404).json({
        success: false,
        message: "can not found course",
      });
    }
    const trainerId = req.user._id;

    if (
      req.user.role !== "admin" &&
      String(trainerId) !== String(findCourse.trainer)
    ) {
      return res.status(403).json({
        success: false,
        message: "this course is not for you",
      });
    }

    const { title, description, order } = req.body;
    const module = new Module({
      title,
      description,
      order,
      course: courseId,
    });

    const savedModule = await module.save();
    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: savedModule,
    });
  } catch (error) {
    next(error);
  }
}

async function updateModule(req, res, next) {
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

    const { title, description, order } = req.body;

    if (title !== undefined) {
      findModule.title = title;
    }
    if (description !== undefined) {
      findModule.description = description;
    }
    if (order !== undefined) {
      findModule.order = order;
    }

    if (
      [title, description, order].every(
        (value) => value === undefined,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }
    const updatedModule = await findModule.save();

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: updatedModule,
    });
  } catch (error) {
    next(error);
  }
}
export { getCourseModules, createModule,updateModule };
