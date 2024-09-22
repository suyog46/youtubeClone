import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import ApiResponse from "../utils/ApiResponse.js";
import subscribeModel from "../models/subscription.model.js";
import mongoose from "mongoose";



const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(404,"channel id notfound")
    }
    console.log("channelID",channelId)
const user=req.user
const userId=user._id
console.log(userId)
if(!userId){
    throw new ApiError(404,"user not found in the request")
}
 const check= await subscribeModel.findOne({
    subscriber:userId,
    channel:channelId
  })
  if(!check){
       const subscriber= await subscribeModel.create({
            subscriber:userId,
            channel:channelId
        })
        if(!subscriber){
            throw new ApiError(404,"There was error in the subdcriber db process")
        }
        return res
        .status(200)
        .json(new ApiResponse(200,subscriber,"success in pushing the data to db"))

  }
  else{
    const deleted=await subscribeModel.findOneAndDelete({
        subscriber:userId,
        channel:channelId
    })
    if(!deleted){
        throw new ApiError(404,"There was error in the removing the data")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,deleted,"success in deleting the data from the db"))

  }

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId){
        throw new ApiError(404,"subscriberID not found in the request")
    }
    const Id =new mongoose.Types.ObjectId(subscriberId)
    const result=await subscribeModel.aggregate([{
    $match:{
        subscriber:Id,
    }
    }])
    if(!result){
        throw new ApiError(404,"there was error in db creation")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,result,"subscribed channel fetched succesfully"))
})
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const{channelId}  = req.params
    if(!channelId){
        throw new ApiError(404,"channelId not found in the request")
    }
    const Id =new mongoose.Types.ObjectId(channelId)
    const result=await subscribeModel.aggregate([{
    $match:{
        channel:Id,
    }
    }])
    if(!result){
        throw new ApiError(404,"there was error in db creation")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,result,"channel subscribers fetched succesfully"))
})
export {toggleSubscription, getSubscribedChannels,getUserChannelSubscribers}
