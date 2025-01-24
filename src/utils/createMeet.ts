import { google } from "googleapis";
import IAttendee from "../types/IAttendee";

const createMeet = async (
  title: string,
  description: string,
  time: Date,
  duration: number,
  accessToken: string,
  attendees: IAttendee[]
): Promise<String> => {
  try {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const event = await calendar.events.insert({
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
    const googleMeetLink = event.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    )?.uri;

    return googleMeetLink as string;
  } catch (error) {
    console.log("Error while creating google meet:", error);
    throw error;
  }
};

export default createMeet;
