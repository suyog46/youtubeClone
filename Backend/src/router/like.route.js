import Router from "router";
import { getLikedVideos, toggleVideoLike } from "../controller/likes.controller.js";
import verifyUser from "../middleware/auth.js";

const likeRouter=Router();

likeRouter.route("/toggleLike/:videoId").post(verifyUser,toggleVideoLike)
likeRouter.route("/getuserlikedVideo").post(verifyUser,getLikedVideos)


export default likeRouter