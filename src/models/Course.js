// const { default: mongoose } = require('mongoose');
// const mongose = require('mongoose');
import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },

        description:{
            type : String,
            required: true,
            trim: true,
        },
        category:{
            type: String,
            required: true,
            trim: true,
        },
        level:{
            type: String,
            enum: ['beginner','intermediate','advanced'],
            required: true,
        },
        status:{
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },
        publishedAt:{
            type: Date,
            default: null,
        },
    },
        {
            timestamps: true
        }

);
// const Course = mongoose.model('Course', courseSchema);
// module.exports = Course;

const Course  = mongoose.model('Course', courseSchema);
export default Course;
