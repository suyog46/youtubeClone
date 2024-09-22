import Router from "router";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controller/subscriber.controller.js";
import verifyUser from "../middleware/auth.js";

const subscribeRouter=Router();

subscribeRouter.route("/toggleSubscription/:channelId").post(verifyUser,toggleSubscription)
subscribeRouter.route("/getSubscribedChannel/:subscriberId").post(verifyUser,getSubscribedChannels)
subscribeRouter.route("/getSubscribersList/:channelId").post(verifyUser,getUserChannelSubscribers)


export default subscribeRouter