import mongoose, { Schema } from "mongoose";
 //pagination ko concept
const playlistSchema=new mongoose.Schema({
  content:{
        type:String,
        required:true
    },
    videos:
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})
const playlistModel=mongoose.model("playlist",playlistSchema);
export default playlistModel