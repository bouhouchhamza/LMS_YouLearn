const Course = require("../models/Course");
const mongoose = require("mongoose");
async function getCourses(req, res, next) {
  try {
    const { keyword, category, level } = req.query;
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
    const courses = await Course.find(filter);
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

module.exports = {
  getCourses,
  getCourseById,
};
