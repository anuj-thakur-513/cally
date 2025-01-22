import { OAuth2Client } from "google-auth-library";
import keys from "../config/keys";

const GOOGLE_CLIENT_ID = keys.googleOAuth.clientId;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid User detected" };
  }
}

export default verifyGoogleToken;
