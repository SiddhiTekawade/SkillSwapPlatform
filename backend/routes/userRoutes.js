// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Maps to: http://localhost:5000/users
router.get("/", userController.getUsers);

module.exports = router;