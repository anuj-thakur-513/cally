import { google } from "googleapis";
import keys from "../config/keys";

const GOOGLE_CLIENT_ID = keys.googleOAuth.clientId;
const GOOGLE_CLIENT_SECRET = keys.googleOAuth.clientSecret;
const GOOGLE_REDIRECT_URI = keys.googleOAuth.authRedirectUri; // TODO: update this
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
function generateAuthUrl() {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  return authUrl;
}

async function verifyGoogleToken(token: string): Promise<any> {
  try {
    const { tokens } = await client.getToken(token);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const userInfo = await oauth2.userinfo.get();
    const data = userInfo.data;

    return {
      userInfo: data,
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
    };
  } catch (error) {
    console.log(error);
    return { error: "Invalid User detected" };
  }
}

export { generateAuthUrl, verifyGoogleToken };
