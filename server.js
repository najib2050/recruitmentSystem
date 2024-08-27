import bodyParser from "body-parser";
import cors from "cors"
import express from "express";
import mongoose from "mongoose"
import bcript from "bcrypt"
import userSchema from "./model/user.js"
import jobSchema from "./model/job.js"
import adminRole from "./middleware/user.js"
import applicationSchema from "./model/application.js";
const app=express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const mongoUrl="mongodb+srv://najiib:najib123@cluster0.7gcqjgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const port=5000
app.listen(port,(err)=>{
   if(err){
      console.log("server has not started")
   }
   console.log(`server has started at port ${port}`)
})
mongoose.connect(mongoUrl).then(result=>console.log("serevre is connected to the database")).catch(error=>console.log("server is not connected to the database "))


app.get("/",(req,res)=>{
   console.log("welcome to server")
   res.send({message:"welcome to rescurement server"})
})
app.post("/regester",async(req,res)=>{
   const {username,email,password,role}=req.body
   try {
      const newUser=new userSchema({
         username,
         email,
         password,
         role
      })
      const isUserExist=await userSchema.findOne({email})
      console.log(req.body)
      console.log("isuserExist ", isUserExist)
      if(isUserExist){
         return res.send({satus:"unsuccefull", data:[], message:"user exist"})
      }else{
         const saveTheUser=await newUser.save()
         return res.send({status:"successfull",userData:{saveTheUser}, message:"you have succefully register"})
      }
      
         
   } catch (error) {
      res.send({message:"cannot regester the user"})
   }
   res.end()

});

app.post("/login",adminRole, async(req,res)=>{
   const {password, email}=req.body;
   try {
      const isUserExist= await userSchema.findOne({email})
      console.log("user details :", isUserExist)

      if(!isUserExist){
         console.log("email doesnt exist")
         return res,send({status:"incorrect", data:[], message:"this user doesnt exist"})
         
      }
      
      const currentUserPassword=req.body.password;
      // console.log("curernt passw: ", currentUserPassword)
      const hashedPasword=isUserExist.password;
      // console.log("hash pass: ", hashedPasword)
     
      bcript.compare(currentUserPassword.toString(), hashedPasword, (err, result) => {
         if (err) {
             // Handle error
             console.error('Error comparing passwords:', err);
             return;
         }
     
     if (result) {
         // Passwords match, authentication successful
         const {username,email,role}=isUserExist
         console.log('Passwords match! User authenticated.');
         return res.send({status:"succefull",data:[username,email,role],message:"successfull loged in"})
     } else {
         // Passwords don't match, authentication failed
         console.log('Passwords do not match! Authentication failed.');
     }
     });
      
   } catch (error) {
      return res.send({message:"login error"})
   }
})

//inserting jop data in the database by emloyer
app.post('/job',async(req,res)=>{
   const {jobtitle,description,requirement,location,employer}=req.body;
   try {
      console.log(req.body)
      const newJob=new jobSchema({jobtitle,description,requirement,location,employer})
      console.log("data is saved")
      const theNewJob=await newJob.save()
      if(!theNewJob){
         return res.send({status:"unsuccefull", data:[], message:"failed to create job"})
      }
      return res.send({status:"succefull", data:[theNewJob], message:"succefully created job for jobseekers"})
      
   } catch (error) {
      console.log("error in creating job")
      res.send({message:"unable to create job"})
   }

})
app.get('/job',async(req,res)=>{
   // { <field>: { $regex: /pattern/, $options: '<options>' } }
   // db.inventory.find( { item: { $not: { $regex: /^p.*/ } } } )
   const {query:{jobtitle}}=req;
   try {
      const isTitleExist={jobtitle}
      console.log("title: ", isTitleExist.jobtitle)
      const title=isTitleExist.jobtitle
      const pattern=`${title}`
         const findJob=await jobSchema.find({jobtitle:{$regex:pattern, $options:"i"}})
         if(!findJob) return res.status(400).send({message:"there is no job posted"})
            const {...data}=findJob
            res.status(200).send(findJob)
         console.log(findJob)  
   
   } catch (error) {
      
   }
})

/// user job application
app.post('/applyingjob',async(req,res)=>{
   const {cvs,jobId,jobseeker}=req.body;
   try {
      const applayer=new applicationSchema({
         jobId,
         jobseeker,
         cvs
      })
      console.log(cvs,jobId,jobseeker)
      const data= await applayer.save()
      res.status(200).send({
         status:"succefull",
         dat:[data],
         message:"you have succefully applied you job thank you"
      })
   } catch (error) {
      console.log("there is sever error")
      res.status(400).send({message:"there is server erro"})
   }
})
app.get("/findingApplicant",async(req,res)=>{
   try {
      
      const applicant=await applicationSchema.find({})
      res.status(200).send({
         status:"succeffull",
         data:[applicant],
   
      })
      console.log(applicant)
   } catch (error) {
      
   }

})

