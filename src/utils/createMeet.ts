import { google } from "googleapis";

const createMeet = async (title: string, description: string, time: Date, duration: number) => {
  try {
    const oAuth2Client = new google.auth.OAuth2();

    // create google meet
    // const calendar = google.calendar({ version: "v3", auth: jwtClient });
    // const event = {
    //   summary: title,
    //   description: description,
    //   start: {
    //     dateTime: time.toISOString(),
    //     timeZone: "Asia/Kolkata",
    //   },
    //   end: {
    //     dateTime: new Date(time.getTime() + duration * 60000).toISOString(),
    //     timeZone: "Asia/Kolkata",
    //   },
    //   conferenceData: {
    //     createRequest: {
    //       requestId: `meet-${Date.now()}`, // Unique request ID
    //       conferenceSolutionKey: {
    //         type: "hangoutsMeet",
    //       },
    //     },
    //   },
    // };
    // const response = await calendar.events.insert({
    //   calendarId: "primary",
    //   requestBody: event,
    //   conferenceDataVersion: 1,
    // });

    // return response.data;
  } catch (error) {
    console.log("Error while creating google meet:", error);
    throw error;
  }
};

export default createMeet;
