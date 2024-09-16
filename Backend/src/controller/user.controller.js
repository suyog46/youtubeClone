import asyncHandler from "../utils/asyncHandler.js";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/apierror.js";
import { cloudresult } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"

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
console.log("refreshToken is",refresh)
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
 
const loggedoutUser=await userModel.findByIdAndUpdate(user._id,{
    $unset: {
        refreshToken: 1 // this removes the field from document
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

const generateAccessToken=asyncHandler(async(req,res)=>{
   
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        throw new ApiError(401,"user not authorized")
    }
    const user=req.user
    console.log("user is ",user)
    console.log("refresh token is ",refreshToken)
    console.log("refresh token secret is",process.env.REFRESH_TOKEN_SECRET)
    if(!user){
        throw new ApiError(404,"user not found in request")
    }
    const dbUser=await userModel.findById(user._id)
   
const verifiedUser= jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
   if(!verifiedUser){
            throw new ApiError(401,"user not verified")
   }
  const newAccessToken=await dbUser.generateAccessToken()
if(!newAccessToken){
    throw new ApiError(400,"there was error in creating new accesstoken")
}
  const options={
    httpOnly:true,
    extended:true
  }
res.cookie("accessToken",newAccessToken,options)
return res
.status(200)
.json(new ApiResponse(200,{},"accessToken regenerated successfully"))
})
const updateProfile=asyncHandler(async(req,res)=>{
    const{username,email}=req.body
    //json wa form bata pathauda aayena but comes through xx-url encoded
    console.log("username and email is ",username,email)
    //yeuta matra pathayo vani ko logic
if(!(username||email)){
    throw new ApiError(404,"user profile to be updated not found")
}
    const id=req.user._id
    console.log("username to be upidatded",username,email)
    const user=await userModel.findByIdAndUpdate(id,{
        $set:{
            username:username,
            email:email
        }
    },
    {$new:true}
).select("-password -refreshToken")
res.
status(200).
json(new ApiResponse(201,user,"data updated successfully"))
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

const user=await userModel.findById(req?.user._id) //middlware bata req.user banauna milxa 
const password=user.isPasswordCorrect(oldPassword)
if(!password){
throw new ApiError(400,"Invalid password")
}
user.password=password
await user.save({validateBeforeSave:false})
return res
.status(200)
.json(new ApiResponse(200,{},"password Changed successfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    const user=req.user
    return res
    .status(200)
    .json(new ApiResponse(200,user,"current user have been fetched"))
})
const updateProfilePicture=asyncHandler(async(req,res)=>{
//patch bata milena
    const profilePath=req.file.path
    if(!profilePath){
        throw new ApiError(404,"profilepath to be updated not found")
    }
    const imagePath=await cloudresult(profilePath)
    if(!imagePath){
        throw new ApiError(404,"imagepath of cloudinary response not found")
    }
    const user=await userModel.findByIdAndUpdate(req.user?._id,{
        $set:{
            userProfile:imagePath.url
        }
    },{
       $new:true
    })
    return res
    .status(200)
    .json(new ApiResponse(200,user,"profile picture updated successfully!"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
const {username}=req.params;
if(!username?.trim()){
    throw new ApiError(404,"username is missing in url parameter")
}
// userModel.find({username})
// userModel.aggregate([{},{}])
const channel=await userModel.aggregate([
    {
    $match:{
        username:username?.tolowercase()
    }
},{
    $lookup:{
        from:"subscriptions", //model ko nam ra tyo lowercase ra plural ma hunxa
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
    }
},
{
    $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
    }
},
{
    $addFields:{
        subscribersCount:{
            $size:"$subscribers"
        },
        subscribedToCuunt:{
            $size:"$subscribedTo"
        },
        isSubscribed:{
            $cond:{
                if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                then:true,
                else:false
                }
        }
    }
},
{
    $project:{
        username:1,
        subscribersCount:1,
        subscribedToCount:1,
        isSubscribed:1,
        email:1,
        userProfile:1
    
    }
}])
console.log("channel is",channel)
if(!channel?.length){
    throw new ApiError(404,"channel does not exist")
}
return res
.status(200)
.json(new ApiResponse(200,channel[0],"User channel info fetched successfully"))
})

const getWatchHistory=asyncHandler(async(req,res)=>{
const user=await userModel.aggregate([
    {$match:{
        _id:new mongoose.Types.ObjectId(req.user?._id)//mongoose ma object id haru string ma store hunxa .so to cakculate exact id

    }

    },
    {
        $lookup:{
            from:"video",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
            pipeline:[  //nested pipeline
                {
                    $lookup:{
                        from:"user",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[ //npw this pipeline will be in owner field 
                            {
                                $project:{
                                    username:1,
                                    email:1,
                                    userProfile:1
                                }
                            },
                            { //array ma aauxa ,so ellai milauna ,array vitra ko object nikalni 
                               $addFields:{
                             owner:{
                                 $first:"$owner"
                             }
                               }    
                            }
                        ]
                    }
                }
            ]
        }
    },

])
return res
.status(200)
.json(new ApiResponse(200,user[0].watchHistory,"Watch History is responded"))

})
export {register,
    login,
    logout,
    updateProfile,
    updateProfilePicture,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    generateAccessToken,
    changeCurrentPassword
}
