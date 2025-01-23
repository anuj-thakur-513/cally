export default {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  googleOAuth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    calendarApiKey: process.env.GOOGLE_CALENDAR_API_KEY,
  },
};
