import axios from "axios";
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
const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

function generateAuthUrl(): string {
  console.log(GOOGLE_REDIRECT_URI);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  return authUrl;
}

async function verifyGoogleToken(token: string): Promise<any> {
  try {
    const { tokens } = await oAuth2Client.getToken(token);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const userInfo = await oauth2.userinfo.get();
    const data = userInfo.data;

    return {
      userInfo: data,
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function isGoogleAccessTokenValid(accessToken: string | null | undefined): Promise<boolean> {
  try {
    if (!accessToken || accessToken === "") return false;
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
    );
    return true;
  } catch (err) {
    return false;
  }
}

async function refreshGoogleTokens(refreshToken: string): Promise<string> {
  try {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oAuth2Client.refreshAccessToken();
    return credentials.access_token as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { generateAuthUrl, verifyGoogleToken, isGoogleAccessTokenValid, refreshGoogleTokens };
