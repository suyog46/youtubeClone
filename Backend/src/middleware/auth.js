import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { ApiError } from "../utils/apierror.js"

const verifyUser=async(req,res,next)=>{
    try {
        console.log("i am in the middleware with access token",req.cookies.accessToken)
        const accessToken=req.cookies.accessToken||req.header("Authorization").replace("Bearer","").trim()
        console.log(accessToken)
        if(!accessToken){
            throw new ApiError(401,"Unauthorized request")
        }
    const user= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    console.log("virifed?=",user)
    if(!user){
        throw new ApiError(204,"there was error in jwt verify")
    }
    const decodedUser=await userModel.findById(user._id).select("-password -refreshToken")
    if(!decodedUser){
        throw new ApiError(204,"user not decoded in auth")
    }
        req.user=decodedUser
     console.log("middleware user is",req.user)

    } catch (error) {
        console.log("there was error in authenticating and adding req.user",error.message)
    }
next()
}
export default verifyUser

