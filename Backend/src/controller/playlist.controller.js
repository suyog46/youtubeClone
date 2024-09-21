import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import ApiResponse from "../utils/ApiResponse.js";
import playlistModel from "../models/playlist.model.js";
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
    const user=req.user
    if(!user){
        throw new ApiError(404,"user not found in the request")
    }
    const userId=user._id
    if(!userId){
        throw new ApiError(404,"user id is absent ")
    }
   const id = new mongoose.Types.ObjectId(userId)
  const playlist=  await playlistModel.aggregate([{
        $match: {
         owner:id
        }
      },
       {
         $unwind: {
           path:"$videos",
           includeArrayIndex: 'string',
         }
       },
       {
         $lookup: {
           from: "videos",
           localField:"videos",
           foreignField:"_id",
           as:"result",
          pipeline:[{
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"user",
              pipeline:[{
                 $project:{
                         username:1,
                        email:1,
                        userProfile:1
                         }
              }
              ]
            }
          }
          ]                    
         }
       }
      
           
      ])

      if(!playlist){
        throw new ApiError(404,"playlist not created")
      }
    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"succesfully fetched playlist"))
})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
  if(!playlistId){
    throw new ApiError(404,"playlist id not requeseted")
  }
  const id =new mongoose.Types.ObjectId(playlistId)
 const playList= await playlistModel.aggregate([{
    $match: {
        _id:id
    }
  },
   {
     $unwind: {
       path:"$videos",
       includeArrayIndex: 'string',
     }
   },
   {
     $lookup: {
       from: "videos",
       localField:"videos",
       foreignField:"_id",
       as:"result",
      pipeline:[{
        $lookup:{
          from:"users",
          localField:"owner",
          foreignField:"_id",
          as:"user",
          pipeline:[{
             $project:{
                     username:1,
                    email:1,
                    userProfile:1
                     }
          }
          ]
        }
      }
      ]                    
     }
   }
  
       
  ])

if(!playList){
    throw new ApiError(404,"plyalist with prvided id not fetched")
}
return res
.status(200)
.json(new ApiResponse(200,playList,"playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(404, "Playlist ID or Video ID not found");
    }

    const vId = new mongoose.Types.ObjectId(videoId)
    console.log(vId)
const check=await playlistModel.aggregate([
    {$match:{
        videos:vId
    }}
])


console.log("check is",check)
if(check.length>0){
    throw new ApiError(400,"video already exixts in the playlist")
}

    const updatedPlaylist = await playlistModel.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: vId,  
            },
        },
        {
            new: true, 
        }
    );

   
    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

  
    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"playlist updated successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(404, "Playlist ID or Video ID not found");
    }


    const vId = new mongoose.Types.ObjectId(videoId);


    const updatedPlaylist = await playlistModel.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: vId },  
        },
        { new: true } 
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
    .status(200).
    json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"));
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
  
    const {name, description} = req.body
    
    if(!playlistId||!name||!description){
        throw new ApiError(404,"playlistId or name or description not found")
    }

    const updatedPlaylist=await playlistModel.findByIdAndUpdate(playlistId,{
        name,
        description
    })
    if(!updatedPlaylist){
        throw new ApiError(404,"error in updating name or description ")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"playlist updated successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;


    if (!playlistId) {
        throw new ApiError(404, "Playlist ID not found");
    }

    const deletedPlaylist = await playlistModel.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deletePlaylist, "Playlist deleted successfully"));
});


export{createPlaylist,getUserPlaylists,getPlaylistById,addVideoToPlaylist,removeVideoFromPlaylist,updatePlaylist,deletePlaylist}