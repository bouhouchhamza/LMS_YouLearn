import ResourceProgress from "../models/ResourceProgress.js";
import Enrollment from "../models/Enrollment.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import mongoose from "mongoose";


export const completeResource = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    if (!mongoose.isValidObjectId(resourceId)){
      return res.status(400).json({
        success: false,
        message: "Invalid resource Id",
      });
    }
    const resource = await Resource.findById(resourceId);
    if(resource === null){
        return res.status(404).json({
            success:false,
            message:'Resource not Found'
        })
    }
    const modul = await Module.findById(resource.module)

    if(modul === null){
        return res.status(404).json({
            success:false,
            message:'Module not Found'
        })
    }
    const enrollmnt = await Enrollment.findOne({
        learner : req.user._id,
        courseId: modul.course,
        status: true
    })
    if(enrollmnt === null){
        return res.status(403).json({
            success:false,
            message: 'Enrollment is not active'
        })
    }
    // const module = await Module.find({module:modul._id});
    const previousModules = await Module.find({
        course: modul.course,
        order: {$lt: modul.order}
    })
    for(const module of previousModules){
       const resources =   await  Resource.find({module: module._id});
       const resourcesIds = resources.map(resource=>resource._id);
       const resourceProgresseCount =await  ResourceProgress.countDocuments({
        enrollment: enrollmnt._id,
        resource: {$in: resourcesIds}
       })
       if(resourceProgresseCount < resources.length){
        return res.status(403).json({
            success:false,
            message: "you have a previous module didn't finish"
        })
       }
    }
    const resourceProgesse = await ResourceProgress.create({
                enrollment:enrollmnt._id,
                resource:resource._id
    })
    return res.status(201).json({
        success:true,
        message:'Resource completed successfully',
        data: resourceProgesse
    })


  } catch (error) {
    if(error.code === 11000){
        return res.status(200).json({
            success:true,
            message:"Resource already completed"
        })
    }
    next(error);
  }
};
