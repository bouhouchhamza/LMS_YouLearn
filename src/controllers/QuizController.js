import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Module from "../models/Module.js";
import Course from "../models/Course.js";
import e from "express";


export const createQuiz = async (req, res, next) => {
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

export const getQuizByModuleId = async (req, res, next) => {
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

export const submitQuiz = async (req, res, next) => {
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

        const your_answers = []
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






