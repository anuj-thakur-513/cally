"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const meetingController_1 = require("../../controllers/meeting/meetingController");
const meetingRouter = (0, express_1.Router)();
meetingRouter.post("/schedule/:receiverId", [auth_1.default, meetingController_1.handleScheduleMeeting]);
meetingRouter.post("/accept/:meetingId", [auth_1.default, meetingController_1.handleAcceptMeeting]);
meetingRouter.post("/reject/:meetingId", [auth_1.default, meetingController_1.handleRejectMeeting]);
meetingRouter.get("/upcoming", [auth_1.default, meetingController_1.handleGetUpcomingMeetings]);
meetingRouter.get("/past", [auth_1.default, meetingController_1.handleGetPastMeetings]);
exports.default = meetingRouter;
