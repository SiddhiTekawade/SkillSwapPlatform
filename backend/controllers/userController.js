const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =========================================================
//                    REGISTER USER
// =========================================================

// @desc Register a new user
// @route POST /api/users/register
// @access Public

exports.registerUser = async (req, res) => {

    try {

        const {
            full_name,
            email,
            password,
            bio,
            location
        } = req.body;


        // Validate required fields

        if (!full_name || !email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "All required fields must be filled"

            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user

        User.create(
            {
                full_name,
                email,
                password: hashedPassword,
                bio,
                location
            },

            (err, result) => {

                if (err) {

                    // Duplicate email

                    if (err.code === "ER_DUP_ENTRY") {

                        return res.status(400).json({

                            success: false,

                            message:
                                "Email already exists"

                        });

                    }


                    console.error(err);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error occurred"

                    });

                }


                return res.status(201).json({

                    success: true,

                    message:
                        "User registered successfully"

                });

            }
        );

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Server error during registration",

            error: error.message

        });

    }

};



// =========================================================
//                    LOGIN USER
// =========================================================

// @desc Login user & get token
// @route POST /api/users/login
// @access Public

exports.loginUser = (req, res) => {

    const {
        email,
        password
    } = req.body;


    // Validate

    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required"

        });

    }


    // Find user by email

    User.findUserByEmail(
        email,

        async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,

                    message:
                        "Database error"

                });

            }


            // User not found

            if (results.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            const user = results[0];


            // Compare password

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!isMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // Generate JWT token

            const token = jwt.sign(

                {
                    id: user.id,
                    email: user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "24h"
                }

            );


            // Send response

            res.status(200).json({

                success: true,

                message:
                    "Login successful",

                token: token,

                user: {

                    id: user.id,

                    email: user.email,

                    full_name:
                        user.full_name

                }

            });

        }

    );

};



// =========================================================
//                    GET USER PROFILE
// =========================================================

// @desc Get logged in user profile
// @route GET /api/users/profile
// @access Private

exports.getProfile = (req, res) => {

    try {

        // User ID comes from authMiddleware

        const userId = req.user;


        // Find user by ID

        User.findUserById(
            userId,

            (err, results) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error"

                    });

                }


                // User not found

                if (results.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "User not found"

                    });

                }


                // Remove password if returned

                const {
                    password,
                    ...userData
                } = results[0];


                return res.status(200).json({

                    success: true,

                    user: userData

                });

            }

        );

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};



// =========================================================
//              UPLOAD PROFILE IMAGE
// =========================================================

// @desc Upload / update logged-in user's profile image
// @route PUT /api/users/profile/image
// @access Private

exports.uploadProfileImage = (req, res) => {

    try {

        // Check if image was uploaded

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select a profile image."

            });

        }


        // Logged-in user's ID

        const userId = req.user;


        // Multer gives us the saved filename

        const profileImage =
            req.file.filename;


        // Update database

        User.updateProfileImage(

            userId,

            profileImage,

            (err, result) => {

                if (err) {

                    console.error(
                        "Profile image database error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to save profile image."

                    });

                }


                // User not found

                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "User not found."

                    });

                }


                // Successful response

                return res.status(200).json({

                    success: true,

                    message:
                        "Profile image updated successfully.",

                    profile_image:
                        profileImage,

                    image_url:
                        `http://localhost:5000/uploads/${profileImage}`

                });

            }

        );

    }

    catch (error) {

        console.error(
            "Profile image upload error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while uploading profile image."

        });

    }

};