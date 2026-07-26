const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // import middleware
const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route
router.get('/profile', protect, getProfile); // aadhi protect, mag getProfile

module.exports = router;