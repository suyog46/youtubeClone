import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { ApiError } from "../utils/apierror.js"

const verifyUser=async(req,res,next)=>{
    try {
        const accessToken=req.cookies.accessToken||req.header("Authorization").replace("Bearer","").trim()
        if(!accessToken){
            throw new ApiError(401,"Unauthorized request")
        }
    const user=await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    if(!user){
        throw new ApiError(204,"there was error in jwt verify")
    }
    const decodedUser=userModel.findById(user._id).select("-password -refreshToken")
    if(!decodedUser){
        throw new ApiError(204,"user not decoded in auth")
    }
        req.user=decodedUser
    } catch (error) {
        console.log("there was error in authenticating and adding req.user",error.message)
    }
next()
}
export default verifyUser

