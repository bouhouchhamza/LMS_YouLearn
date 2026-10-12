import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const enroll = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    const learnerId = req.user._id;
    if (!course) {
      return res.status(404).json({
        message: "Course is not available",
      });
    }
    if (course.status !== "published") {
      return res.status(403).json({
        message: "you can't register in this Course",
      });
    }
    let enrollment = await Enrollment.findOne({
      courseId: courseId,
      learner: learnerId,
      status: true,
    });
    if (enrollment) {
      return res.status(409).json({
        message: "you already been registed in this course",
      });
    } else {
      enrollment = new Enrollment({
        learner: learnerId,
        courseId: courseId,
      });
    }
    await enrollment.save();
    return res.status(201).json({
      message: "your registre success",
    });
  } catch (error) {
    next(error);
  }
};
export const cancelEnroll = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const learnerId = req.user._id;

    const enrollment = await Enrollment.findOne({
      learner: learnerId,
      courseId: courseId,
      status: true,
    });
    if (!enrollment) {
      return res.status(404).json({
        message: "enrollemnt Not Found",
      });
    }
    await enrollment.cancel();
    return res.status(200).json({
      message: "enrollment cancel successfully",
    });
  } catch (error) {
    next(error);
  }
};
