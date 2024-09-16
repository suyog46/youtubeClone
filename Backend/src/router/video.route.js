import Router from "router";
import upload from "../middleware/multer.js";
import verifyUser from "../middleware/auth.js";
import { publishVideo } from "../controller/video.controller.js";
const videoRouter=Router();

videoRouter.route("/postVideo").post(verifyUser,upload.fields(
    [{name:"thumbnail",maxCount:1},
     {name:"videoFile",maxCount:1}   
    ]
    ),publishVideo)

export default videoRouter
