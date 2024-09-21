import commentModel from "../models/comment.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apierror.js";
import asyncHandler from "../utils/asyncHandler.js";


const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {comment}=req.body
    const user=req.user
    if(!user||!videoId||!comment){
        throw new ApiError(400,"videoId or user not found")
    }
  const result=  await commentModel.create({
        videoId,
        comment,
        owner:user._id
    })
    if(!result){
        throw new ApiError(404,"error in the comment collection creation")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,result,"comment pushed to the db successfully"))
})


const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
const pageNumber=parseInt(page)
const limitNumber=parseInt(limit)
   

//check this again for larger data
if(!videoId){
        throw new ApiError(404,"videoId not found in the request")
    }
   const comment= await commentModel.aggregate([
      
        {
            $limit:limitNumber
        },
        {
            $skip:(pageNumber-1) * limitNumber
        },
        {
            $lookup:  {
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
              }]
              
        }
    }

    ])
    if(!comment){
        throw new ApiError(404,"comment not found")
    }
return res
.status(200)
.json(new ApiResponse(200,comment,"comment fetched successfully"))
})


const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const user=req.user
    const userId=user._id
console.log("user",userId)
console.log(commentId)
    if(!userId||!commentId){
        throw new ApiError(404,"commentId or userId not found")
    }
    const{comment}=req.body
if(!comment){
    throw new ApiError(404,"comment to be updated not found ")
}
  const updatedComment=  await commentModel.findByIdAndUpdate(commentId,{
    $set:{
        comment:comment
    }
    },{
        new:true
    })

if(!updatedComment){
    throw new ApiError(404,"there was error in updating the comment")
}
return res
.status(200)
.json(new ApiResponse(200,updatedComment,"comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(404, "Comment ID not found");
    }

    const deletedComment = await commentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export {getVideoComments,addComment,updateComment,deleteComment}