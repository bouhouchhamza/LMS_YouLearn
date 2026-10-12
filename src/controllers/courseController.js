import Course from "../models/Course.js";
import mongoose from "mongoose";

async function getCourses(req, res, next) {
  try {
    const { keyword, category, level, sort } = req.query;
    const filter = {
      status: "published",
    };
    if (keyword) {
      filter.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }
    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }
    if (level) {
      const allowedLevels = ["beginner", "intermediate", "advanced"];

      if (!allowedLevels.includes(level.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalide course level",
        });
      }
      filter.level = level.toLowerCase();
    }
    const allowedSorts = ["createdAt", "publishedAt"];
    let query = Course.find(filter);
    if (sort) {
      if (!allowedSorts.includes(sort)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sort field",
        });
      }
      query = query.sort({ [sort]: -1 });
    }
    const courses = await query;
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
}

async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalide course id",
      });
    }
    const course = await Course.findOne({
      _id: id,
      status: "published",
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

async function createCourse(req, res, next) {
  try {
    const { title, description, category, level } = req.body;
    const trainerId = req.user._id;
    const course = new Course({
      title: title,
      description: description,
      category: category,
      level: level,
      trainer: trainerId,
    });

    const savedCourse = await course.save();
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCourse(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: " course id i not valid",
      });
    }
    const findCourse = await Course.findById(id);
    if (!findCourse) {
      return res.status(404).json({
        success: false,
        message: "can not found course",
      });
    }
    const trainerId = req.user._id;
    const { title, description, category, level } = req.body;
    if (
      req.user.role !== "admin" &&
      String(trainerId) !== String(findCourse.trainer)
    ) {
      return res.status(403).json({
        success: false,
        message: "this course is not for you",
      });
    }

    if (title !== undefined) {
      findCourse.title = title;
    }
    if (description !== undefined) {
      findCourse.description = description;
    }
    if (category !== undefined) {
      findCourse.category = category;
    }
    if (level !== undefined) {
      findCourse.level = level;
    }
    if (
      [title, description, category, level].every(
        (value) => value === undefined,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const updatedCourse = await findCourse.save();
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
}

export { getCourses, getCourseById, createCourse, updateCourse };
