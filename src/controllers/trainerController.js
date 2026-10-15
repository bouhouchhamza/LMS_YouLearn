import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import ResourceProgress from "../models/ResourceProgress.js";
export const getTrainerCourses = async (req, res, next) => {
  try {
    const formateur = req.user._id;
    if (!formateur) {
      return res.status(403).json({
        success: false,
        message: "User not Found",
      });
    }
    const courses = await Course.find({ trainer: formateur });
    return res.status(200).json({
      success: true,
      message: "Your liste of course:",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseLearner = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalide course ID",
      });
    }
    const course = await Course.findById(courseId);
    if (course === null) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const owner = req.user._id;
    if (req.user.role !== "admin" && !course.trainer.equals(owner)) {
      return res.status(403).json({
        success: false,
        message: "You don't own this course",
      });
    }
    const enrollment = await Enrollment.find({
      courseId: courseId,
      status: true,
    }).populate("learner", "fullName email");
    return res.status(200).json({
      success: true,
      message: "Those are your learners: ",
      count: enrollment.length,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};
export const getLearnerProgress = async (req,res,next)=>{
    try{
        const {courseId, learnerId}= req.params;
        if(!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(learnerId)){
            return res.status(400).json({
                success:false,
                message: 'Invalid ID'
            })
        }
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message: 'Course not found'
            })
        }
        if(
            req.user.role !== 'admin' &&
            !course.trainer?.equals(req.user._id)
        ){
            return res.status(403).json({
                success:false,
                message: 'you are not the owner of this Course'
            })
        }

        const enrollment = await Enrollment.findOne({
            learner: learnerId,
            courseId: courseId,
            status:true
        })
        if(!enrollment){
            return res.status(404).json({
                success: false,
                message: 'enrollment not found'
            })
        }
        const completedResources = await ResourceProgress.find({
            enrollment: enrollment._id,
        }).populate("resource", 'title type module order')
        const modules = await Module.find({
            course: courseId
        })
        const mdouleIds = modules.map(modul => modul._id);
        const resources = await Resource.find({
            module: {$in: mdouleIds}
        });
        const result = completedResources.filter((completed)=>{
            return resources.some((resource)=>{
                return completed.resource?._id.equals(resource._id);
            })
        })
        return res.status(200).json({
            success: true,
            progress: enrollment.progress,
            totalResources: resources.length,
            completedCount: result.length,
            completedResources: result
        })
    }catch(error){
        next(error)
    }
}