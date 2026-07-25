const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Maps to: POST /api/users/register
router.post("/register", userController.registerUser);

module.exports = router;