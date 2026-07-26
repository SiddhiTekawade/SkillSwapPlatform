
// backend/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // 🔒 Step 1: Import bcrypt
const jwt = require("jsonwebtoken"); // Step 3: Import JWT

exports.registerUser = async (req, res) => {
    try {
        // Read data from request body
        const { full_name, email, password, bio, location } = req.body;

        // Validate required fields
        if (!full_name ||!email ||!password) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // 🔒 Step 1: Hash the plain text password securely before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // KEEPING YOUR WORKING CALLBACK STRUCTURE
        User.create({ full_name, email, password: hashedPassword, bio, location }, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
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
        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message
        });
    }
};

// Step 3 & 4: New Login Function
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validate
    if (!email ||!password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // 1. Step 4: Find User by Email using model function
    User.findUserByEmail(email, async (err, results) => {
        if (err) {
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
            { id: user.id, email: user.email },
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