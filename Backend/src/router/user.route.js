import Router from "router";
import { register } from "../controller/user.controller.js";
import upload from "../middleware/multer.js";
const router=Router()

router.route("/register").post(upload.fields(
[{name:"userProfile",
    maxCount:1
}]
),register)
export default  router