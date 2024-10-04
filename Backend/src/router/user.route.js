import Router from "router";
import { register,login,logout, getCurrentUser, updateProfile, updateProfilePicture, getUserChannelProfile, getWatchHistory, generateAccessToken, changeCurrentPassword, googleLogin } from "../controller/user.controller.js";
import upload from "../middleware/multer.js";
import verifyUser from "../middleware/auth.js";
import passport from "passport";
const router=Router()

router.route("/register").post(upload.fields(
[{name:"userProfile",
    maxCount:1
}]
),register)

router.route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));


  router.route('/auth/google/callback')
  .get(
    passport.authenticate('google', { failureRedirect: '/login' }), 
    googleLogin
  );


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
