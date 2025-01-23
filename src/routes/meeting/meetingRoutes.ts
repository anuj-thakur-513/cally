import { Router } from "express";
import verifyToken from "../../middlewares/auth";
import { handleScheduleMeeting } from "../../controllers/meeting/meetingController";

const meetingRouter = Router();

meetingRouter.post("/schedule/:receiverId", [verifyToken, handleScheduleMeeting]);

export default meetingRouter;
