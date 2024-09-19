import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apierror.js";
import { cloudresult } from "../utils/Cloudinary.js";
import { videoModel } from "../models/video.model.js";
import mongoose from "mongoose";


const publishVideo=asyncHandler(async(req,res)=>{
    const{title,description}=req.body
    const user=req.user
    if(!user){
        throw new ApiError(404,"there was error in fetching user data")
    }
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
    duration:fvideoPath.duration,
    owner:user._id
})
if(!createdVideo){
    throw new ApiError(400,"errror in puhsing video data to the db")
}
return res
.status(200)
.json(new ApiResponse(201,createdVideo,"user video data pushed to db succesfull!"))
})

const getAllVideos=asyncHandler(async(req,res)=>{
    const page=req.query.page||1;
    const limit=req.query.limit||3;
    const query=req.query.query||'';
    const sortType=req.query.sort||'asc';
    const sortBy=req.query.sortBy||'createdAt';
//query ma kehi napathauda
    const pageNumber=parseInt(page);
    const limitNumber=parseInt(limit);
    const sort= sortType === 'asc' ? 1 : -1 ;

    console.log("sabai parameters"+"page is"+page+"limit is"+limit+"query is"+query+"sorttype is"+sort+"sortby is"+sortBy,pageNumber,limitNumber)

        
    const matchStage = query?{ title:{ $regex: query, $options: 'i' } }  :{};  //$options:i for case insesitive
//  extra double quotes should not be included in the regex pattern, which can cause  query to not find any matches in the database.
    console.log("matchstage",matchStage)

      const result = await videoModel.aggregate( [
    {
          $match: matchStage
        },
        {
          $sort: { [sortBy]:sort }  // Sort based on the provided field and order. Use square brackets when you want to dynamically assign an object key based on a variable’s value.
        },
        {
          $skip: (pageNumber - 1) * limitNumber  // Skip the results for previous pages
        },
        {
          $limit: limitNumber  // Limit the results to the specified page size
        },{
            $lookup:  {
                from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"result"
        }
    } ]  );

    console.log("return videos",result)
      if (result.length === 0) { //array return garxa ,ani empty pani huna sakxa
        throw new ApiError(404, "No videos found matching the query");
    }
console.log(
    "legnth is",result.length
)
    const totalCount = result.length;
    
      if(!totalCount){
throw new ApiError(404,"error in counting values")
      }


if(!result){
    throw new ApiError(400,"there was error in retrieving the video data")
}
return res
.status(200)
.json(new ApiResponse(200,{result,totalCount},"video retrieved succesfully"))
})


const getVideoById   = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(404,"videoId not found in the request")
    }
    const objectId = new mongoose.Types.ObjectId(videoId);

    const videos =await videoModel.aggregate(
        [
            {$match:{
                _id:objectId
            }},
            {
                $lookup:  {
                    from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"result"
            }
        }
        ]
    )
    if(!videos){
        throw new ApiError(404,"error in fetching the videos")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"video by id fetched successfully"))
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
        if(!videoId){
            throw new ApiError(404,"videoid not found")
        }  
        
    const{title,description}=req.body
    console.log("title,description",title,description)
    if(!(title||description)){
        throw new ApiError(404,"title or description to be updated not found")
    }
    console.log("=req.file",req.file)
    const thumbnail=req.file?.path         
    if(!thumbnail){
        throw new ApiError(404,"thumbnail not found in the request file")
    }
    const thumbnailPath=await cloudresult(thumbnail)
    const video=await videoModel.findByIdAndUpdate(videoId,{
        $set:{
            thumbnail:thumbnailPath.url,
            title:title,
            description:description,
        }
    },{
        $new:true
    })
    if(!video){
        throw new ApiError(404,"error in updating the video data")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,video,"video updated successfully "))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "videoId not found in the request");
    }

  
    const video = await videoModel.findByIdAndDelete(videoId);

    
    if (!video) {  //delete vaye pani tesko delete hunu vanda agadi ko result chai contain garxa
        throw new ApiError(404, "Video not found"); 
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Video deleted successfully"));
});

//user le video hide garexa ki dekhauni garera rakhexa vnni controller

export {publishVideo,getAllVideos, getVideoById, updateVideo, deleteVideo}