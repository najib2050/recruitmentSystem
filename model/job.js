import mongoose from "mongoose";


const jobSChema=new mongoose.Schema({
   jobtitle:{type:String, required:true},
   description:{type:String, required:true},
   requirement:{type:String, required:true},
   location:{type:String},
   employer:{type:String}
},{timestamp:true})

export default mongoose.model("jobschema",jobSChema)