import mongoose from "mongoose";



const resourceProgressSchema = new mongoose.Schema({
        enrollment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Enrollment",
            required:true
        },
        resource:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Resource",
            required:true
        },
        completedAt:{
            type:Date,
            default:Date.now
        }

},{timestamps: true})
resourceProgressSchema.index(
    {enrollment:1, resource:1},
    {unique: true}
);

const ResourceProgress = mongoose.model('ResourceProgress', resourceProgressSchema);

export default ResourceProgress;