const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // 🔒 For hashing password
const jwt = require("jsonwebtoken"); // 🔑 For JWT

// @desc Register a new user
// @route POST /api/users/register
// @access Public
exports.registerUser = async (req, res) => {
    try {
        const { full_name, email, password, bio, location } = req.body;

        // Validate required fields
        if (!full_name ||!email ||!password) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Hash the plain text password securely before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DB
        User.create({ full_name, email, password: hashedPassword, bio, location }, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error occurred"
                });
            }

            // Return success response
            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message
        });
    }
};

// @desc Login user & get token
// @route POST /api/users/login
// @access Public
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validate
    if (!email ||!password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // 1. Find User by Email using model function
    User.findUserByEmail(email, async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password" // security sathi generic
            });
        }

        const user = results[0];

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // payload madhe id takli
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // 4. Return success with token
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name
            }
        });
    });
};

// @desc Get logged in user profile - DAY 7
// @route GET /api/users/profile
// @access Private - Protected by authMiddleware
exports.getProfile = (req, res) => {
    try {
        // req.user = middleware ne token madhun kadhun takla aahe
        const userId = req.user;

        // DB madhun user chi info kadha
        User.findUserById(userId, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Password kadhun tak
            const { password,...userData } = results[0];

            res.status(200).json({
                success: true,
                user: userData
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};