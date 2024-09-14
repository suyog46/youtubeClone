import asyncHandler from "../utils/asyncHandler.js";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/apierror.js";
import { cloudresult } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";


const register=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if([username,email,password].some((field)=>{field.trim()===""})){
        throw new ApiError(404,"username or email or password cannot be empty")
    }

 
const existedUser = await userModel.findOne({
    $or: [{ username }, { email }]
})

if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}
  
    const userProfilePath=req.files?.userProfile[0].path;

    if(!userProfilePath){
        throw new ApiError(404,"file is not uploaded through multer")
    }

    const profilePath=await cloudresult(userProfilePath)


    const user=await userModel.create({
        username,
        email,
        password:password,
        userProfile:profilePath.url
    })
    if(!user){
        throw new ApiError(400,"there was error while pushing the data to the db")
    }
    const createdUser=await userModel.findById(user._id).select("-password -refreshToken")
    return res.
    status(200).
    json( new ApiResponse(201,createdUser,"data pushed to db succesfully!"))

})

const generateAccessRefreshToken=async(user)=>{
    try {
        
const access=  await user.generateAccessToken()
const refresh=  await user.generateRefreshToken()
user.refreshToken=refresh
await user.save({validateBeforeSave:false})
console.log("function vitra ko ",access,refresh)
return {access,refresh}

    } catch (error) {
        console.log("there was error while generating the acess and refresh token",error.message)
    }
}

const login=asyncHandler(async(req,res)=>{

    const{email,password,username}=req.body

    const user=await userModel.findOne({
        $or:[{email},{username}]
    }
        )
    if(!user){
        throw new ApiError(404,"user with this email does not exist")
    }
console.log("user is",user)
   const puser= await user.isPasswordCorrect(password)
    if(!puser){
        throw new ApiError(403,"password does not match")
    }

const{access,refresh}=await generateAccessRefreshToken(user)
console.log("accessToken is",access)
const options={
    httpOnly:true,
    secure:true
}
res.status(200).cookie("accessToken",access,options).cookie("refreshToken",refresh,options)

const userinfo=await userModel.findById(user._id).select("-password -refreshToken")
res.
status(200)
.json(new ApiResponse(200,userinfo,"user logged in successfully "))
})

const logout=asyncHandler(async(req,res)=>{
   const user=req.user
userModel.findByIdAndUpdate(user._id,{
    $set:{
        refreshToken:undefined
    }
},{new:true})

const options={
    httpOnly:true,
    secure:true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"user logged out successfully"))
})
export {register,login,logout}