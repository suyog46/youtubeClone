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
return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function( ){
    const accessToken=await jwt.sign({
        id:this.email,
        username:this.username,
        email:this.email
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
    return accessToken
}
userSchema.methods.generateRefreshToken=async function( ){
  const refreshToken= await  jwt.sign({
        id:this.email,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
    return refreshToken
}
userSchema.methods.verifyUser=async function(refreshToken){
try {
       const userVerify= await jwt.verify(this.refreshToken,refreshToken)
       return userVerify
} catch (error) {
    console.log("there was error in matching the token",error.message)
}
}

const userModel=mongoose.model("user",userSchema)
export default userModel