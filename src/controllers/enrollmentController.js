import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { sendEnrollmentEmail, sendEnrollmentCancelledEmail } from "../services/email/emailService.js";
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
    try{
      const sendingEmail = await sendEnrollmentEmail({
      to: req.user.email,
      learnerName: req.user.fullName,
      courseTitle: course.title,
    });
    if(sendingEmail.success === false){
      console.error('Enrollemnt saved, but email notification failed');
    }
    }catch(error){
      console.error('Email notification failed');
    }
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

    const enrollment = await Enrollment.findOneAndUpdate({
      learner: learnerId,
      courseId: courseId,
      status: true,
    }, { $set: { status: false, cancelledAt: new Date() } }, { new: true });
    if (!enrollment) {
      return res.status(404).json({
        message: "enrollemnt Not Found",
      });
    }
    try {
      const course = await Course.findById(courseId);
      if (course) await sendEnrollmentCancelledEmail({
        to: req.user.email, learnerName: req.user.fullName, courseTitle: course.title,
      });
    } catch {
      console.error('Cancellation notification failed');
    }
    return res.status(200).json({
      message: "enrollment cancel successfully",
    });
  } catch (error) {
    next(error);
  }
};
