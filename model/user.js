import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt"
const userSchema= new mongoose.Schema({
   username:{type:String, required:true},
   password:{type:String, required:true},
   email:{type:String, required:true, unique:true},
   role:{type:String, enum:["employer","jobseeker"], required:true}
},{timestamp:true})

//hash before saveing
//Pre middleware functions are executed one after another, when each middleware calls next.
userSchema.pre("save",function(next){
   const user=this;
   if(!user.isModified("password"))
      next()
   bcrypt.genSalt(10,(err,salt)=>{
      if(err){
         console.log("cannot generate salt")
         next()
      }
      const password=user.password
      bcrypt.hash(password,salt,(err,hash)=>{
         if(err){
            console.log("error cannot hash the password")
            next()
         }else{
            console.log("hash :", hash)
            user.password=hash
            next()
         }
      })
   })
})

// })

export default mongoose.model("userSchema", userSchema)