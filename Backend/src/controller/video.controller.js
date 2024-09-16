import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apierror.js";
import { cloudresult } from "../utils/Cloudinary.js";
import { videoModel } from "../models/video.model.js";

const publishVideo=asyncHandler(async(req,res)=>{
    const{title,description}=req.body
    if(!(title||description)){
        throw new ApiError(404,"title or description not found")
    }
    console.log("req.file is ",req.files)
    const thumbnailPath=req.files?.thumbnail[0].path;
    if(!thumbnailPath){
        throw new ApiError(404,"thumbnailpath not found in request body")
    }
    const fthumbnailPath=await cloudresult(thumbnailPath)
    if(!fthumbnailPath){
        throw new ApiError(409,"error in uploading video to cloudinary ")
    }
const videoPath=req.files?.videoFile[0].path;
if(!videoPath){
    throw new ApiError(404,"videopath not found in request body")
}
const fvideoPath=await cloudresult(videoPath)
if(!fvideoPath){
    throw new ApiError(409,"error in uploading video to cloudinary ")
}
console.log("video succesfully uploaded to cloudinary!",fvideoPath)
console.log("thumbnail succesfully uploaded to cloudinary!")


const createdVideo=await videoModel.create({
    title,
    description,
    videoFile:fvideoPath.url,
    thumbnail:fthumbnailPath.url,
    duration:fvideoPath.duration
})
if(!createdVideo){
    throw new ApiError(400,"errror in puhsing video data to the db")
}
return res
.status(200)
.json(new ApiResponse(201,createdVideo,"user video data pushed to db succesfull!"))
})

export {publishVideo}