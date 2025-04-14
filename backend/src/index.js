const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();

const app = express();

// Serve the public directory
app.use(express.static(path.join(__dirname, '../public/')));

// Every other get will serve index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`running server on ${process.env.PORT}.`);
});