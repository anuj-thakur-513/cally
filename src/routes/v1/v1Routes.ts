import { Router } from "express";
import userRouter from "../user/userRoutes";
import meetingRouter from "../meeting/meetingRoutes";

const v1Router = Router();

v1Router.use("/user", userRouter);
v1Router.use("/meeting", meetingRouter);

export default v1Router;
