import mongoose, { Schema } from "mongoose";


//comment ma like dekhauna
const likeSchema=new mongoose.Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }

},
{timestamps:true})
 const likeModel=mongoose.model("likes",likeSchema)
 export default likeModel