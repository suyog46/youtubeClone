import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apierror.js";
import likeModel from "../models/likes.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const user=req.user
    const userId=user._id
    console.log("videoId",videoId)  
    if(!videoId||!user){
        throw new ApiError(404,"videoId or user not found")
    }
const check=await likeModel.findOne({
    video:videoId,
    likedBy:userId,
})
console.log("check",check)


if(!check){
    const likes=await likeModel.create({
        likedBy:userId,
        video:videoId
    })
    if(!likes){
        throw new ApiError(404,"error in creating db ")
    }
}
if(check){
     const unlike=   await likeModel.findOneAndDelete({ video: videoId, likedBy: user._id });
     
     if(!unlike){
         throw new ApiError(400,"there was error in unliking the video ")
     }

}
    return res
    .status(200)
    .json(new ApiResponse(200,{},"likes data updated successfully!")) //return garda kheri k return garni 

})

const getLikedVideos = asyncHandler(async (req, res) => {
   const user=req.user
   const userId=user._id
if(!userId){
    throw new ApiError(404,"there was error in getting the user ")
}
const userLikedVideo =await likeModel.find({
    likedBy:userId
})
if(!userLikedVideo){
    throw new ApiError(404,"error in retreiving the data")
}
return res
.status(200)
.json(new ApiResponse(200,userLikedVideo,"liked video retrieved successfully"))
})
export {toggleVideoLike,getLikedVideos}