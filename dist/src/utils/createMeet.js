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
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const createMeet = (title, description, time, duration, accessToken, attendees) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const oAuth2Client = new googleapis_1.google.auth.OAuth2();
        oAuth2Client.setCredentials({ access_token: accessToken });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: oAuth2Client });
        const event = yield calendar.events.insert({
            calendarId: "primary",
            sendNotifications: true,
            conferenceDataVersion: 1,
            requestBody: {
                attendees: attendees.map((attendee) => ({
                    email: attendee.email,
                    displayName: attendee.name,
                    responseStatus: attendee.responseStatus,
                })),
                start: {
                    dateTime: time.toISOString(),
                },
                end: {
                    dateTime: new Date(time.getTime() + duration * 60000).toISOString(),
                },
                summary: title,
                description: description,
                transparency: "opaque",
                visibility: "private",
                conferenceData: {
                    createRequest: {
                        requestId: `${new Date().getTime()}`,
                        conferenceSolutionKey: { type: "hangoutsMeet" },
                    },
                },
            },
        });
        // Extract the Google Meet link from the response
        const googleMeetLink = (_c = (_b = (_a = event.data.conferenceData) === null || _a === void 0 ? void 0 : _a.entryPoints) === null || _b === void 0 ? void 0 : _b.find((entry) => entry.entryPointType === "video")) === null || _c === void 0 ? void 0 : _c.uri;
        return googleMeetLink;
    }
    catch (error) {
        console.log("Error while creating google meet:", error);
        throw error;
    }
});
exports.default = createMeet;
