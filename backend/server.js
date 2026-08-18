const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes"); // Imported Day 4 MVC Routes file

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded profile images
app.use("/uploads", express.static("uploads"));

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// Serve uploaded files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

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

// Day 2 Homework Routes
app.get('/contact', (req, res) => {
    res.send("Contact us at support@skillswapplatform.com");
});

app.get('/skills', (req, res) => {
    res.send("Explore learning pathways: Web Development, Design, Marketing.");
});

// Replace app.use("/users", userRoutes); with this line:
app.use("/api/users", userRoutes);
// Start Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});