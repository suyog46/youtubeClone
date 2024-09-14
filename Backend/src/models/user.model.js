import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    refreshToken:{
        type:String
    },
    userProfile:{
        type:String,

    }
},{
    timestamps:true
})
userSchema.pre("save",async function(next){
    if(this.isModified("password")){  
        this.password = await bcrypt.hash(this.password,10)
       
            next(); 
    }
})


userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(this.password,password)
}



const userModel=mongoose.model("user",userSchema)
export default userModel