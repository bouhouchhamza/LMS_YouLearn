import Feedback from "../models/Feedback.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

export async function createFeedback(req, res, next) {
    try {
        const trainerId = req.user._id;
        const courseId = req.params.courseId;
        const learnerId = req.params.learnerId;

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const courseExists = await Course.findById(courseId);

        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (courseExists.trainer.toString() !== trainerId.toString()) {
            return res.status(403).json({
                message: "You are not allowed to give feedback for this course"
            });
        }

        const learnerExists = await User.findById(learnerId);

        if (!learnerExists) {
            return res.status(404).json({
                message: "Learner not found"
            });
        }

        const enrollmentExists = await Enrollment.findOne({
            courseId,
            learner: learnerId
        });
        console.log(enrollmentExists)

        if (!enrollmentExists) {
            return res.status(404).json({
                message: "Learner is not enrolled in this course"
            });
        }

        const feedback = await Feedback.create({
            trainerId,
            learnerId,
            courseId,
            content: content.trim()
        });

        return res.status(201).json({
            message: "Feedback created successfully",
            data: feedback
        });

    } catch (error) {
        next(error);
    }
}

export async function getFeedback(req, res, next) {
    try {
        const learnerId = req.user._id;
        const { courseId } = req.params;

        const feedback = await Feedback.find({
            courseId,
            learnerId
        });

        if (feedback.length === 0) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            message: "Feedback retrieved successfully",
            data: feedback
        });

    } catch (error) {
        next(error);
    }
}

export async function updateFeedback(req, res, next) {
    try {
        const trainerId = req.user._id;
        const { courseId, learnerId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const feedback = await Feedback.findOneAndUpdate(
            { courseId, learnerId, trainerId },
            { content },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            message: "Feedback updated successfully",
            data: feedback
        });
        
    } catch (error) {
        next(error);
    }
}

export async function deleteFeedback(req, res, next) {
    try {

        const trainerId = req.user._id;
        const { courseId , learnerId } = req.params
        
        const feedback = await Feedback.findOneAndDelete({
            courseId,
            learnerId,
            trainerId
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            message: "Feedback deleted successfully",
            data: feedback
        });

    } catch (error) {
        next(error);
    }
}


