import mongoose  from "mongoose";

const applicationSchema=new mongoose.Schema({
   jobId:{type:mongoose.Schema.ObjectId, ref:"job"},
   jobseeker:{type:mongoose.Schema.ObjectId,ref:"jobhunter"},
   cvs:{type:String, required:true}

},{timestamp:true});
// no hasshing
export default mongoose.model("applicationSchema",applicationSchema)