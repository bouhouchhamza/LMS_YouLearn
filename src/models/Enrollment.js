import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    learner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    progress:{
        type:Number,
        default : 0,
        max : 100,
        min : 0
    },
    cancelledAt:{
        type:Date,
        default: null
    }
    
},
{ 
        timestamps:true
    }
)

enrollmentSchema.methods.isActive = function(){
    return this.status === true;
};
enrollmentSchema.methods.cancel =async function (){
     this.status = false ;
     this.cancelledAt = new Date();
     await this.save();
     return [this.status,this.cancelledAt];
};
enrollmentSchema.index(
    {learner:1, courseId:1},
    {
        unique: true,
        partialFilterExpression:{status:true}
    }
);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

export default Enrollment;