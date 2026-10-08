import Course  from "../models/Course.js";
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
    const allowedSorts = ['createdAt', 'publishedAt'];
    let query = Course.find(filter);
    if(sort){
        if(!allowedSorts.includes(sort)){
            return res.status(400).json({
                success: false,
                message: 'Invalid sort field',
            });
        }
        query = query.sort({[sort]: -1});
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

export {
  getCourses,
  getCourseById,
};;
