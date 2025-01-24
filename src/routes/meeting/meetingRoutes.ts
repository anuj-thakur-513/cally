import { Router } from "express";
import verifyToken from "../../middlewares/auth";
import {
  handleAcceptMeeting,
  handleGetUpcomingMeetings,
  handleScheduleMeeting,
} from "../../controllers/meeting/meetingController";

const meetingRouter = Router();

meetingRouter.post("/schedule/:receiverId", [verifyToken, handleScheduleMeeting]);
meetingRouter.post("/accept/:meetingId", [verifyToken, handleAcceptMeeting]);
// TODO: get all the upcoming events with their status, reject invitation, sent requests, count of past events
meetingRouter.get("/upcoming", [verifyToken, handleGetUpcomingMeetings]);

export default meetingRouter;
