const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Day 2 Core Routes
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

// Day 2 Homework Routes (Kept safe here!)
app.get('/contact', (req, res) => {
    res.send("Contact us at support@skillswapplatform.com");
});

app.get('/skills', (req, res) => {
    res.send("Explore learning pathways: Web Development, Design, Marketing.");
});

// Day 3 - Step 9: Live Database Query Route (Replaces old mock route)
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

// Start Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});