import Router from "router";
import { register,login,logout, getCurrentUser, updateProfile, updateProfilePicture, getUserChannelProfile, getWatchHistory, generateAccessToken, changeCurrentPassword } from "../controller/user.controller.js";
import upload from "../middleware/multer.js";
import verifyUser from "../middleware/auth.js";
const router=Router()

router.route("/register").post(upload.fields(
[{name:"userProfile",
    maxCount:1
}]
),register)
router.route("/login").post(login)
router.route("/logout").post(verifyUser,logout)
router.route("/accessToken").post(verifyUser,generateAccessToken)   
router.route("/updateProfile").patch(verifyUser,updateProfile)
router.route("/changePassword").post(verifyUser,changeCurrentPassword)
router.route("/getCurrentUser").get(verifyUser,getCurrentUser)
router.route("/updateProfilePicture").post(verifyUser,upload.single("userProfile"),updateProfilePicture)
router.route("/channelinfo/:username").get(verifyUser,getUserChannelProfile)

// router.route("") cover image update garni
router.route("/watchHistory").get(verifyUser,getWatchHistory)




export default  router
