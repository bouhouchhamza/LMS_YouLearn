const Course = require('../models/Course');

async function getCourses(req, res, next){
    try{
        const courses = await Course.find({
            staus: 'published',
        });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    }catch(error){
        next(error);
    }
}

module.exports = {
    getCourses,
}