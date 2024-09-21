import Router from "router";
import verifyUser from "../middleware/auth.js";
import { addComment, getVideoComments, updateComment } from "../controller/comment.controller.js";

const commentRouter=Router();

commentRouter.route("/addComment/:videoId").post(verifyUser,addComment)
commentRouter.route("/getallComments/:videoId").post(verifyUser,getVideoComments)
commentRouter.route("/updateComment/:commentId").patch(verifyUser,updateComment)
commentRouter.route("/deleteComment/:commentId").patch(verifyUser,updateComment)//left to  test



export default commentRouter