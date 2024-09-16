import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/user.route.js";
import videoRouter from "./router/video.route.js";
const app=express();

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
         credentials:true
    }
))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users",router)
app.use("/api/v1/videos",videoRouter)

export default app
