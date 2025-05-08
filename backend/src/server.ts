import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Middleware
import auth from "./middleware/auth.ts";
import { error } from "./middleware/error.ts";
import { notFound } from "./middleware/not-found.ts";

// Routes
import user from "./routes/user.ts"
import activity from "./routes/activity.ts"

// Get __dirname for setup because we are using ES6 modules by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("x-powered-by", false);

// ----- REST APIS -----
app.use("/api", activity);

// ----- WEB APPLICATION -----
// Auth0 for web application
app.use(auth)

// REST API for retrieving user details
app.use("/api", user);


app.use(notFound);
app.use(error);

// Serve the public directory
app.use(express.static(path.join(__dirname, '../public/')));

export default app;