import mongoose, { Schema } from "mongoose";

const playlistSchema=new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
        required:true

    },
    description:{
        type:String,
        required:true
    },
    videos:[
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})
const playlistModel=mongoose.model("playlist",playlistSchema);
export default playlistModel