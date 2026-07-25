/*
const User = require("../models/userModel");

exports.getUsers = (req, res) => {
    // Calling the function we just created inside userModel.js
    User.getAll((err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};
*/

const User = require("../models/userModel");

exports.registerUser = (req, res) => {
    // 1. Read data from req.body
    const { full_name, email, password, bio, location } = req.body;

    // 2. Validate required fields
    if (!full_name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be filled"
        });
    }

    // 3. Call the model function
    User.create({ full_name, email, password, bio, location }, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                // 4. Return JSON response for failure (Email already exists)
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

        // 4. Return JSON response for success
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    });
};