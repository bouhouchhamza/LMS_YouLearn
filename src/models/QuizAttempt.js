import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    submittedAnswers: [{
        questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz.questions",
        required: true
        },
        selectedAnswer: {
        type: Number,
        required: true
        }
    }],
    passed:{
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("QuizAttempt", quizAttemptSchema);

