const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} = require("../controllers/userController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


/*=========================================================
                    PUBLIC ROUTES
=========================================================*/

// Register
router.post(
    "/register",
    registerUser
);


// Login
router.post(
    "/login",
    loginUser
);


/*=========================================================
                    PROTECTED ROUTES
=========================================================*/

// Get logged-in user's profile
router.get(
    "/profile",
    protect,
    getProfile
);


// Update logged-in user's profile
router.put(
    "/profile",
    protect,
    updateProfile
);


module.exports = router;