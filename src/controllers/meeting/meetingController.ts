import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Db from "../../services/Db";
import AppError from "../../core/AppError";
import ApiResponse from "../../core/ApiResponse";

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
    });

    if (!meeting) {
      return next(new AppError(500, "Error in sending meeting request"));
    }

    // TODO: call microservice to send email to the receiver

    res.status(200).json(new ApiResponse(meeting, "Meeting request sent successfully"));
  }
);

export { handleScheduleMeeting };
