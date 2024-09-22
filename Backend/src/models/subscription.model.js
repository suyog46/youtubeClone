import mongoose, { Schema } from "mongoose";

const subscriptionSchema=new mongoose.Schema({
    subscriber:{
        type:Schema.Types.ObjectId ,
        //one who is subcribing
        ref:"user"
    },

    channel:{     //one to whom subscriber is subscribing 
        type:Schema.Types.ObjectId,
        ref:"user"
    }

},{timestamps:true})

const subscribeModel=mongoose.model("subscription",subscriptionSchema)
export default subscribeModel