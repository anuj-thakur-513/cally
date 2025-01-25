import { NextFunction, Request, response, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Db from "../../services/Db";
import AppError from "../../core/AppError";
import ApiResponse from "../../core/ApiResponse";
import createMeet from "../../utils/createMeet";
import invokeEmailer from "../../utils/invokeEmailer";

const prisma = Db.getPrismaClient();

const handleScheduleMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }
    const { receiverId } = req.params;
    const { title, description, time } = req.body;

    if (!title || !description || !time) {
      return next(new AppError(400, "Title, description and time for the meeting are required"));
    }

    if (new Date(time) < new Date()) {
      return next(new AppError(400, "Meeting time cannot be in the past"));
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: parseInt(receiverId),
      },
    });

    if (!receiver) {
      return next(new AppError(404, "Receiver not found"));
    }

    const meeting = await prisma.meetings.create({
      data: {
        senderId: user?.id,
        receiverId: parseInt(receiverId),
        title: title,
        description: description,
        time: time,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        receiver: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!meeting) {
      return next(new AppError(500, "Error in sending meeting request"));
    }

    await invokeEmailer(meeting.receiver.email, user.email, user.name);

    res.status(200).json(new ApiResponse(meeting, "Meeting request sent successfully"));
  }
);

const handleAcceptMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }
    const { meetingId } = req.params;
    const meeting = await prisma.meetings.findUnique({
      where: {
        id: parseInt(meetingId),
        receiverId: user?.id,
      },
      include: {
        sender: true,
      },
    });

    if (!meeting) {
      return next(new AppError(404, "Meeting not found"));
    }

    const attendees = [
      {
        email: meeting.sender.email,
        name: meeting.sender.name,
        responseStatus: "needsAction",
      },
      {
        email: user.email,
        name: user.name,
        responseStatus: "accepted",
      },
    ];

    const meet = await createMeet(
      meeting.title,
      meeting.description,
      meeting.time,
      meeting.durationMinutes,
      user.googleAccessToken,
      attendees
    );

    const updatedMeeting = await prisma.meetings.update({
      where: {
        id: parseInt(meetingId),
      },
      data: {
        accepted: true,
        meetLink: meet as string,
        responded: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(new ApiResponse(updatedMeeting, "Meeting accepted successfully"));
  }
);

const handleRejectMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }
    const { meetingId } = req.params;
    const meeting = await prisma.meetings.findUnique({
      where: {
        id: parseInt(meetingId),
        receiverId: user?.id,
      },
    });

    if (!meeting) {
      return next(new AppError(404, "Meeting not found"));
    }

    const updatedMeeting = await prisma.meetings.update({
      where: {
        id: parseInt(meetingId),
      },
      data: {
        accepted: false,
        responded: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(new ApiResponse(updatedMeeting, "Meeting rejected successfully"));
  }
);

const handleGetUpcomingMeetings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }

    const meetings = await prisma.meetings.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
        time: {
          gt: new Date(),
        },
      },
      include: {
        sender: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(200).json(new ApiResponse(meetings, "Upcoming Meetings sent successfully"));
  }
);

const handleGetPastMeetings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }

    const meetings = await prisma.meetings.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
        time: {
          lt: new Date(),
        },
      },
      include: {
        sender: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
      take: 10,
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json(new ApiResponse(meetings, "Past Meetings sent successfully"));
  }
);

export {
  handleScheduleMeeting,
  handleAcceptMeeting,
  handleRejectMeeting,
  handleGetUpcomingMeetings,
  handleGetPastMeetings,
};
