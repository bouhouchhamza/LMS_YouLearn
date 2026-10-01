const mongoose = require('mongoose');
const Module = require('../models/Module');
const Resource = require('../models/Resource');

async function getModeleResources(res,req,next){
    try {
        const {moduleId} = req.params;

        if(!mongoose.isValidObjectId(moduleId)){
            return res.status(400).json({
                success : false,
                message: 'Invalid module id',
            });
        }
        const moduleExists = await Module.findById(moduleId);
        
        if(!moduleExists){
            return res.status(404).json({
                success: false,
                message: "Module not found",
            });
        }
        const resources = await Resource.find({
            module: moduleId,
        }).sort({
            order: 1,
        });
        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources,
        });
    }catch(error){
        next(error);
    }
}
module.exports= {
    getModeleResources,
}