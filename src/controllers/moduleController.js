// const mongoose = require('mongoose');
// const Course = require('../models/Course');
// const Module = require('../models/Module');
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
async function getCourseModules(req, res, next){
    try{
        const { courseId} = req.params;
        if(!mongoose.isValidObjectId(courseId)){
            return res.status(400).json({
                success: false,
                message: 'Invalid course id',
            });
        }
        const course = await Course.findOne({
            _id:courseId,
            status: 'published',
        });
    
    const modules = await Module.find({
        course : courseId,
    }).sort({
        order:1,
    });
    res.status(200).json({
        success: true,
        count: modules.length,
        data:modules, 
    });
    }catch(error) {
        next(error);
    }
}
// module.exports = {
//     getCourseModules
// }
export default getCourseModules;
