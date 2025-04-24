import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import 'dotenv/config';

// Astro import
import { handler as ssrHandler } from '../dist/server/entry.mjs'

// Get __dirname for setup because we are using ES6 modules by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Serve the public directory
app.use(express.static(path.join(__dirname, '../public/')));

// Astro base directory
const base = '/';
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

// // Every other get will serve index.html
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.listen(process.env.PORT, () => {
    console.log(`running server on ${process.env.PORT}.`);
});