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
import list from "./routes/list.ts";

// Get __dirname for setup because we are using ES6 modules by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("x-powered-by", false);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ----- REST APIS -----
// /api/activity api
app.use("/api", activity);
app.use("/api", list);

// ----- WEB APPLICATION -----
// Auth0 for web application
app.use(auth);

// /api/user api secured via Auth0
app.use("/api", user);

// Serve the public directory
app.use(express.static(path.join(__dirname, '../public/')));

// ----- ERRORS -----
app.use(notFound);
app.use(error);

export default app;