import express, { Request, Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import 'dotenv/config';
import { auth, ConfigParams } from "express-openid-connect"

// Routes
import user from "./routes/user.js"

// Get __dirname for setup because we are using ES6 modules by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;



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
    }
};

// Auth0 for web application
app.use(auth(authConfig))

app.use("/api", user);

// Serve the public directory
app.use(express.static(path.join(__dirname, '../public/')));

app.listen(PORT, () => {
    console.log(`running server on ${PORT}.`);
});