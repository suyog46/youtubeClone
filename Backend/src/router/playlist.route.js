import Router from "router";
import verifyUser from "../middleware/auth.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controller/playlist.controller.js";


const playlistRouter=Router();


playlistRouter.route("/createPlaylist").post(verifyUser,createPlaylist)
playlistRouter.route("/getUserPlaylist").post(verifyUser,getUserPlaylists)
playlistRouter.route("/getPlayListById/:playlistId").post(verifyUser,getPlaylistById)
playlistRouter.route("/addVideoToPlayList/:playlistId/videos/:videoId").post(verifyUser,addVideoToPlaylist)
playlistRouter.route("/removeVideoFromPlayList/:playlistId/videos/:videoId").get(verifyUser,removeVideoFromPlaylist)
playlistRouter.route("/updatePlayList/:playlistId").patch(verifyUser,updatePlaylist)
playlistRouter.route("/deletePlayList/:playlistId").patch(verifyUser,deletePlaylist)


export default playlistRouter
