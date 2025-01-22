import { Router } from "express";
import rateLimiter from "../../middlewares/rateLimiter";
import { handleGoogleAuth } from "../../controllers/user/userController";

const userRouter = Router();

userRouter.get("/googleAuth", rateLimiter, handleGoogleAuth);

export default userRouter;
