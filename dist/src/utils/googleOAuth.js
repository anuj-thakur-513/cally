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
exports.generateAuthUrl = generateAuthUrl;
exports.verifyGoogleToken = verifyGoogleToken;
exports.isGoogleAccessTokenValid = isGoogleAccessTokenValid;
exports.refreshGoogleTokens = refreshGoogleTokens;
const axios_1 = __importDefault(require("axios"));
const googleapis_1 = require("googleapis");
const keys_1 = __importDefault(require("../config/keys"));
const GOOGLE_CLIENT_ID = keys_1.default.googleOAuth.clientId;
const GOOGLE_CLIENT_SECRET = keys_1.default.googleOAuth.clientSecret;
const GOOGLE_REDIRECT_URI = keys_1.default.googleOAuth.authRedirectUri; // TODO: update this
const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];
const oAuth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
function generateAuthUrl() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
    });
    return authUrl;
}
function verifyGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tokens } = yield oAuth2Client.getToken(token);
            oAuth2Client.setCredentials(tokens);
            const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oAuth2Client });
            const userInfo = yield oauth2.userinfo.get();
            const data = userInfo.data;
            return {
                userInfo: data,
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token,
            };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
function isGoogleAccessTokenValid(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!accessToken || accessToken === "")
                return false;
            const response = yield axios_1.default.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
function refreshGoogleTokens(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            oAuth2Client.setCredentials({ refresh_token: refreshToken });
            const { credentials } = yield oAuth2Client.refreshAccessToken();
            return credentials.access_token;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
