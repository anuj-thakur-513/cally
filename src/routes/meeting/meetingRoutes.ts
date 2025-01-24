import { Router } from "express";
import verifyToken from "../../middlewares/auth";
import {
  handleAcceptMeeting,
  handleGetPastMeetings,
  handleGetUpcomingMeetings,
  handleScheduleMeeting,
} from "../../controllers/meeting/meetingController";

const meetingRouter = Router();

meetingRouter.post("/schedule/:receiverId", [verifyToken, handleScheduleMeeting]);
meetingRouter.post("/accept/:meetingId", [verifyToken, handleAcceptMeeting]);

// TODO: reject invitation
meetingRouter.get("/upcoming", [verifyToken, handleGetUpcomingMeetings]);
meetingRouter.get("/past", [verifyToken, handleGetPastMeetings]);

export default meetingRouter;
