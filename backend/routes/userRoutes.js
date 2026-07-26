const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Maps to: POST /api/users/register
router.post("/register", userController.registerUser);

//login api
router.post("/login", userController.loginUser);

module.exports = router;