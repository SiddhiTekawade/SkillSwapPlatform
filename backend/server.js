const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("Welcome to Skill Swap Platform API 🚀");
});

app.get("/about", (req, res) => {
    res.send("This is the Skill Swap Platform backend.");
});

app.get("/api", (req, res) => {
    res.json({
        project: "Skill Swap Platform",
        version: "1.0",
        status: "Running"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});