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
    status(201).
    json( new ApiResponse(201,createdUser,"data pushed to db succesfully!"))

})
export {register}