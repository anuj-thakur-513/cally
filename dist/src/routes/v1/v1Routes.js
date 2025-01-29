"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("../user/userRoutes"));
const meetingRoutes_1 = __importDefault(require("../meeting/meetingRoutes"));
const v1Router = (0, express_1.Router)();
v1Router.use("/user", userRoutes_1.default);
v1Router.use("/meeting", meetingRoutes_1.default);
exports.default = v1Router;
