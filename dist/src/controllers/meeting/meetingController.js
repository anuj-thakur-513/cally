"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetPastMeetings = exports.handleGetUpcomingMeetings = exports.handleRejectMeeting = exports.handleAcceptMeeting = exports.handleScheduleMeeting = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const Db_1 = __importDefault(require("../../services/Db"));
const AppError_1 = __importDefault(require("../../core/AppError"));
const ApiResponse_1 = __importDefault(require("../../core/ApiResponse"));
const createMeet_1 = __importDefault(require("../../utils/createMeet"));
const invokeEmailer_1 = __importDefault(require("../../utils/invokeEmailer"));
const prisma = Db_1.default.getPrismaClient();
const handleScheduleMeeting = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const { receiverId } = req.params;
    const { title, description, time } = req.body;
    if (!title || !description || !time) {
        return next(new AppError_1.default(400, "Title, description and time for the meeting are required"));
    }
    if (new Date(time) < new Date()) {
        return next(new AppError_1.default(400, "Meeting time cannot be in the past"));
    }
    const receiver = yield prisma.user.findUnique({
        where: {
            id: parseInt(receiverId),
        },
    });
    if (!receiver) {
        return next(new AppError_1.default(404, "Receiver not found"));
    }
    const existingMeeting = yield prisma.meetings.findMany({
        where: {
            time: time,
            senderId: user.id,
            receiverId: parseInt(receiverId),
        },
    });
    if (existingMeeting.length > 0) {
        return next(new AppError_1.default(400, "Meeting request already sent to the user for this time"));
    }
    const meeting = yield prisma.meetings.create({
        data: {
            senderId: user === null || user === void 0 ? void 0 : user.id,
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
        return next(new AppError_1.default(500, "Error in sending meeting request"));
    }
    yield (0, invokeEmailer_1.default)(meeting.receiver.email, user.email, user.name);
    res.status(200).json(new ApiResponse_1.default(meeting, "Meeting request sent successfully"));
}));
exports.handleScheduleMeeting = handleScheduleMeeting;
const handleAcceptMeeting = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const { meetingId } = req.params;
    const meeting = yield prisma.meetings.findUnique({
        where: {
            id: parseInt(meetingId),
            receiverId: user === null || user === void 0 ? void 0 : user.id,
        },
        include: {
            sender: true,
        },
    });
    if (!meeting) {
        return next(new AppError_1.default(404, "Meeting not found"));
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
    const meet = yield (0, createMeet_1.default)(meeting.title, meeting.description, meeting.time, meeting.durationMinutes, user.googleAccessToken, attendees);
    const updatedMeeting = yield prisma.meetings.update({
        where: {
            id: parseInt(meetingId),
        },
        data: {
            accepted: true,
            meetLink: meet,
            responded: true,
        },
        omit: {
            createdAt: true,
            updatedAt: true,
        },
    });
    res.status(200).json(new ApiResponse_1.default(updatedMeeting, "Meeting accepted successfully"));
}));
exports.handleAcceptMeeting = handleAcceptMeeting;
const handleRejectMeeting = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const { meetingId } = req.params;
    const meeting = yield prisma.meetings.findUnique({
        where: {
            id: parseInt(meetingId),
            receiverId: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    if (!meeting) {
        return next(new AppError_1.default(404, "Meeting not found"));
    }
    const updatedMeeting = yield prisma.meetings.update({
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
    res.status(200).json(new ApiResponse_1.default(updatedMeeting, "Meeting rejected successfully"));
}));
exports.handleRejectMeeting = handleRejectMeeting;
const handleGetUpcomingMeetings = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const meetings = yield prisma.meetings.findMany({
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
            receiver: {
                select: {
                    name: true,
                    profilePicture: true,
                },
            },
        },
    });
    res.status(200).json(new ApiResponse_1.default(meetings, "Upcoming Meetings sent successfully"));
}));
exports.handleGetUpcomingMeetings = handleGetUpcomingMeetings;
const handleGetPastMeetings = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const meetings = yield prisma.meetings.findMany({
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
            receiver: {
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
    res.status(200).json(new ApiResponse_1.default(meetings, "Past Meetings sent successfully"));
}));
exports.handleGetPastMeetings = handleGetPastMeetings;
