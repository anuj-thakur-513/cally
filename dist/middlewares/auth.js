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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../core/AppError"));
const keys_1 = __importDefault(require("../config/keys"));
const Db_1 = __importDefault(require("../services/Db"));
const googleOAuth_1 = require("../utils/googleOAuth");
const cookiesConfig_1 = require("../config/cookiesConfig");
const prisma = Db_1.default.getPrismaClient();
const verifyToken = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    const decoded = jsonwebtoken_1.default.verify(token, keys_1.default.jwt.secret);
    const user = yield prisma.user.findUnique({
        where: {
            id: decoded.userId,
        },
        select: {
            id: true,
            email: true,
            name: true,
            googleId: true,
            googleRefreshToken: true,
        },
    });
    if (!user) {
        return next(new AppError_1.default(401, "Unauthorized"));
    }
    let googleAccessToken = ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.googleToken) || ((_d = req.header("Google-Token")) === null || _d === void 0 ? void 0 : _d.split(" ")[1]);
    const isGoogleTokenValid = yield (0, googleOAuth_1.isGoogleAccessTokenValid)(googleAccessToken);
    if (!isGoogleTokenValid) {
        googleAccessToken = yield (0, googleOAuth_1.refreshGoogleTokens)(user.googleRefreshToken);
        if (googleAccessToken) {
            res.cookie("googleToken", googleAccessToken, Object.assign(Object.assign({}, cookiesConfig_1.AUTH_COOKIE_OPTIONS), { maxAge: 60 * 60 * 1000 }));
        }
        else {
            return next(new AppError_1.default(401, "Unauthorized"));
        }
    }
    req.user = Object.assign(Object.assign({}, user), { googleAccessToken });
    next();
}));
exports.default = verifyToken;
