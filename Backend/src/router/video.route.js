import Router from "router";
import upload from "../middleware/multer.js";
import verifyUser from "../middleware/auth.js";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, updateVideo } from "../controller/video.controller.js";
const videoRouter=Router();

videoRouter.route("/postVideo").post(verifyUser,upload.fields(
    [{name:"thumbnail",maxCount:1},
     {name:"videoFile",maxCount:1}   
    ]
    ),publishVideo)
videoRouter.route("/getallVideos").post(verifyUser,getAllVideos)
videoRouter.route("/getVideoById/:videoId").post(verifyUser,getVideoById)
videoRouter.route("/updateVideo/:videoId").patch(verifyUser,upload.single("thumbnail"),updateVideo)
videoRouter.route("/deleteVideo/:videoId").get(verifyUser,deleteVideo)

export default videoRouter
