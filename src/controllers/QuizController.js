import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Module from "../models/Module.js";
import Course from "../models/Course.js";


export const createQuiz = async (req, res, next) => {
    try {
        
        const moduleId = req.params.moduleId;
        const { title, passingScore, questions } = req.body;
        const moduleExists = await Module.findById(moduleId);
        const trainerId = req.user._id;


        if(!moduleExists){
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        const courseExists = await Course.findById(moduleExists.course);

        if (!courseExists) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if(courseExists.trainer.toString() !== trainerId.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to create a quiz for this module"
            });
        }

        const quiz = await Quiz.create({
            title,
            moduleId,
            passingScore,
            questions
        });

        return res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz
        });

    } catch (error){
        next(error);
    }

};
