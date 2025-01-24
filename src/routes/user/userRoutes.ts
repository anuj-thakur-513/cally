import { Router } from "express";
import rateLimiter from "../../middlewares/rateLimiter";
import {
  handleAuthCheck,
  handleGoogleAuth,
  handleGoogleRedirect,
} from "../../controllers/user/userController";
import verifyToken from "../../middlewares/auth";

const userRouter = Router();

userRouter.post("/googleAuth", rateLimiter, handleGoogleAuth);
userRouter.post("/googleRedirect", handleGoogleRedirect);
userRouter.get("/isAuthenticated", verifyToken, handleAuthCheck);

export default userRouter;
