import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/user.route.js";
import videoRouter from "./router/video.route.js";
import playlistRouter from "./router/playlist.route.js";
import commentRouter from "./router/comment.route.js";
import likeRouter from "./router/like.route.js";
import subscribeRouter from "./router/subcription.route.js";
import  passport  from "./middleware/passport.js";
import session from 'express-session';

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



app.use(session({
    secret: process.env.SESSION_SECRET || '1234', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false } 
  }));
  

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users",router)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/subscription",subscribeRouter)


export default app
