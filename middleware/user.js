// assigning roles=> jobseeker and emloyee(admin)
import userSchema from "../model/user.js"
const adminRoles=(req,res,nesxt)=>{
   const {role}=req.body;
   const isRoleExist=userSchema.findOne({role})
   console.log(req.body.role)
   if(!isRoleExist){
      return res.send({message:"that role doesnt exist"})
   }
   else if(role==="employer"){
      console.log("successfully login")
      return res.send({message:"successfully login"})
   }else{
      res.send({message:"your no admin, access denaid"})
      console.log("your not admin, access denaid")

   }

}
export default adminRoles;
