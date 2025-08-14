import { auth, ConfigParams } from "express-openid-connect";

// Auth config for web application
const authConfig: ConfigParams = {
  issuerBaseURL: process.env.AUTH_AUTH0_ISSUER,
  baseURL: "http://localhost:3000",
  clientID: process.env.AUTH_AUTH0_ID,
  secret: process.env.AUTH_SECRET,
  clientSecret: process.env.AUTH_AUTH0_SECRET,
  idpLogout: true,
  authorizationParams: {
    response_type: "code",
    response_mode: "query",
    scope: "openid profile email",
  },
};

export default auth(authConfig);
