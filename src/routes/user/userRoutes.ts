import { Router } from "express";
import rateLimiter from "../../middlewares/rateLimiter";
import {
  handleAuthCheck,
  handleGetUser,
  handleGoogleAuth,
  handleGoogleRedirect,
  handleLogout,
} from "../../controllers/user/userController";
import verifyToken from "../../middlewares/auth";

const userRouter = Router();

userRouter.post("/googleAuth", rateLimiter, handleGoogleAuth);
userRouter.post("/googleRedirect", handleGoogleRedirect);
userRouter.post("/logout", handleLogout);

userRouter.get("/receiver/:userId", verifyToken, handleGetUser);
userRouter.get("/isAuthenticated", verifyToken, handleAuthCheck);

export default userRouter;
