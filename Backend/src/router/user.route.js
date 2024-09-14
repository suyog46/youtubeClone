import Router from "router";
import { register,login,logout } from "../controller/user.controller.js";
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
export default  router
