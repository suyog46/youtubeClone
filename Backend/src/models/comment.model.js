import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema=new mongoose.Schema({
  comment:{
        type:String,
        required:true
    },
    videoId:
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

commentSchema.plugin(mongooseAggregatePaginate)

const commentModel=mongoose.model("comments",commentSchema);
export default commentModel