import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apierror";
import ApiResponse from "../utils/ApiResponse";
import playlistModel from "../models/playlist.model";
import mongoose from "mongoose";

const createPlaylist=asyncHandler(async(req,res)=>{
    const{name,description,videoId}=req.body
    //array of video lai aru kehi bata pathauna milxa ra 
    if(!name||!description||videoId.length==0){
        throw new ApiError(404,"name or descriptionor videos not found for the playlist")
    }
    const owner=req.user
    if(!owner){
        throw new ApiError(404,"user not found in request file")
    }

   const playlist= await playlistModel.create({
        name,
        description,
        videos:videoId,
        owner:owner._id
    })
    if(!playlist){
        throw new ApiError(404,"playlist not created")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"playlist created successfully"))
})
const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(404,"user id is absent ")
    }
   const id = new mongoose.Types.ObjectId(userId)
    await playlistModel.aggregate([
        {

            $match:{
                owner:id
            }
        } 
        //aru k k chainxa 
])
})
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
  if(!playlistId){
    throw new ApiError(404,"playlist id not requeseted")
  }
  const id =new mongoose.Types.ObjectId(playlistId)
  await playlistModel.aggregate([
    {
        $match:{
            _id:id
        }
    },
    {
        $lookup:{
            from:"video",
            foreignField:"",
            localField:""
        }
    }
  ])
})
