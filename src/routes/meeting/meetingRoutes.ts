import { Router } from "express";
import verifyToken from "../../middlewares/auth";
import {
  handleAcceptMeeting,
  handleScheduleMeeting,
} from "../../controllers/meeting/meetingController";

const meetingRouter = Router();

meetingRouter.post("/schedule/:receiverId", [verifyToken, handleScheduleMeeting]);
meetingRouter.post("/accept/:meetingId", [verifyToken, handleAcceptMeeting]);

export default meetingRouter;
