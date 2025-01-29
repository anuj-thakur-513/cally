"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_1 = __importDefault(require("../../middlewares/rateLimiter"));
const userController_1 = require("../../controllers/user/userController");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const userRouter = (0, express_1.Router)();
userRouter.post("/googleAuth", rateLimiter_1.default, userController_1.handleGoogleAuth);
userRouter.post("/googleRedirect", userController_1.handleGoogleRedirect);
userRouter.post("/logout", userController_1.handleLogout);
userRouter.get("/receiver/:userId", auth_1.default, userController_1.handleGetUser);
userRouter.get("/isAuthenticated", auth_1.default, userController_1.handleAuthCheck);
exports.default = userRouter;
