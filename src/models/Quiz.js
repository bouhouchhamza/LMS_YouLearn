import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    options: {
        type: [String],
        required: true
    },

    correctAnswer: {
        type: Number,
        required: true
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },

    passingScore: {
        type: Number,
        default: 60,
        min: 0,
        max: 100
    },

    questions: {
        type: [questionSchema],
        default: []
    }
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);

