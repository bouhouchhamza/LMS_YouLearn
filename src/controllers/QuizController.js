import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Module from "../models/Module.js";
import Course from "../models/Course.js";



export async function createQuiz (req, res, next){
    try {
        
        const moduleId = req.params.moduleId;
        const { title, passingScore, questions } = req.body;
        const moduleExists = await Module.findById(moduleId);
        const trainerId = req.user._id

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

export async function getQuizByModuleId(req, res, next){
    try {

        const moduleId = req.params.moduleId;
        const quiz = await Quiz.findOne({ moduleId }).select({
            "_id":0,
            title:1,
            "questions._id":1,
            "questions.question":1,
            "questions.options":1
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Quiz retrieved successfully",
            data: quiz
        });

    } catch (error) {
        next(error);
    }
}

export async function submitQuiz (req, res, next){
    try {
        const moduleId = req.params.moduleId;
        const { answers } = req.body;
        const quiz = await Quiz.findOne({ moduleId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        const without_db_answer = answers.reduce((without_db,answer) => {
            if(!without_db.some(e => e.questionId === answer.questionId)){
                without_db.push(answer)
            }
            return without_db
        },[])
        

        let Score = 0
        without_db_answer.forEach(e => {
            const correctAnswers = quiz.questions.find(q =>
                q._id.toString() === e.questionId
                &&
                q.correctAnswer === e.selectedAnswer
            )
        
            if(correctAnswers){
                Score += 10
            }
        
        })

        return res.status(201).json({
            Score
        })
    
    }catch (error) {
        next(error);
    }

}

export async function updateQuiz(req, res, next) {
    try {
        const moduleId = req.params.moduleId;
        const trainerId = req.user._id;
        const { title, passingScore, questions } = req.body;

        const moduleExists = await Module.findById(moduleId);

        if (!moduleExists) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        const courseExists = await Course.findById(moduleExists.course);

        if (!courseExists) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (courseExists.trainer.toString() !== trainerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this quiz"
            });
        }

        const quiz = await Quiz.findOneAndUpdate(
            { moduleId },
            { title, passingScore, questions },
            { new: true, runValidators: true }
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: quiz
        });

    } catch (error) {
        next(error);
    }
}

export async function deleteQuiz(req, res, next) {
    try {
        const moduleId = req.params.moduleId;
        const trainerId = req.user._id;

        const moduleExists = await Module.findById(moduleId);

        if (!moduleExists) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        const courseExists = await Course.findById(moduleExists.course);

        if (!courseExists) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (courseExists.trainer.toString() !== trainerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this quiz"
            });
        }

        const quiz = await Quiz.findOneAndDelete({ moduleId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}