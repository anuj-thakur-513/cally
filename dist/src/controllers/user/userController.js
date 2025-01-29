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
exports.handleGetUser = exports.handleLogout = exports.handleAuthCheck = exports.handleGoogleRedirect = exports.handleGoogleAuth = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../../core/AppError"));
const googleOAuth_1 = require("../../utils/googleOAuth");
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const ApiResponse_1 = __importDefault(require("../../core/ApiResponse"));
const cookiesConfig_1 = require("../../config/cookiesConfig");
const Db_1 = __importDefault(require("../../services/Db"));
const prisma = Db_1.default.getPrismaClient();
const handleGoogleAuth = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authUrl = (0, googleOAuth_1.generateAuthUrl)();
    res.status(200).json(new ApiResponse_1.default(authUrl, "OK"));
}));
exports.handleGoogleAuth = handleGoogleAuth;
const handleGoogleRedirect = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    if (!code)
        throw new Error("Authorization code missing");
    const { userInfo, googleAccessToken, googleRefreshToken } = yield (0, googleOAuth_1.verifyGoogleToken)(code);
    if (!userInfo || !googleAccessToken || !googleRefreshToken) {
        throw new Error("Unable to fetch user profile");
    }
    let user = yield prisma.user.findUnique({
        where: { email: userInfo.email },
    });
    if (user) {
        yield prisma.user.update({
            where: {
                email: userInfo.email,
            },
            data: {
                googleRefreshToken: googleRefreshToken,
            },
        });
    }
    else {
        user = yield prisma.user.create({
            data: {
                email: userInfo.email,
                googleId: userInfo.id,
                googleRefreshToken: googleRefreshToken,
                name: userInfo.name,
                profilePicture: userInfo.picture,
            },
        });
    }
    const accessToken = (0, generateToken_1.default)(user.id, user.email);
    res
        .status(200)
        .cookie("accessToken", accessToken, Object.assign(Object.assign({}, cookiesConfig_1.AUTH_COOKIE_OPTIONS), { maxAge: 30 * 24 * 60 * 60 * 1000 }))
        .cookie("googleToken", googleAccessToken, Object.assign(Object.assign({}, cookiesConfig_1.AUTH_COOKIE_OPTIONS), { maxAge: 60 * 60 * 1000 }))
        .json(new ApiResponse_1.default({
        user: {
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
            id: user.id,
            googleId: user.googleId,
        },
    }, "User authenticated succesfully"));
}));
exports.handleGoogleRedirect = handleGoogleRedirect;
const handleAuthCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(new ApiResponse_1.default({
        isAuthenticated: true,
    }, "Authenticated"));
});
exports.handleAuthCheck = handleAuthCheck;
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("googleToken")
        .json(new ApiResponse_1.default(null, "Logged out"));
});
exports.handleLogout = handleLogout;
const handleGetUser = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const { userId } = req.params;
    const userDetails = yield prisma.user.findUnique({
        where: {
            id: parseInt(userId),
        },
        select: {
            id: true,
            name: true,
            profilePicture: true,
        },
    });
    if (!userDetails) {
        return next(new AppError_1.default(404, "User not found"));
    }
    res.status(200).json(new ApiResponse_1.default(userDetails, "user details sent succesfully"));
}));
exports.handleGetUser = handleGetUser;
