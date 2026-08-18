const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/*=========================================================
                    REGISTER USER
=========================================================*/

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.registerUser = async (req, res) => {

    try {

        const {
            full_name,
            email,
            password,
            bio,
            location
        } = req.body;


        /*---------------------------------------------
                    VALIDATION
        ---------------------------------------------*/

        if (
            !full_name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All required fields must be filled"

            });

        }


        /*---------------------------------------------
                    HASH PASSWORD
        ---------------------------------------------*/

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        /*---------------------------------------------
                    CREATE USER
        ---------------------------------------------*/

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

                    if (
                        err.code ===
                        "ER_DUP_ENTRY"
                    ) {

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

        console.error(
            "Register Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error during registration"

        });

    }

};


/*=========================================================
                    LOGIN USER
=========================================================*/

// @desc    Login user & get JWT token
// @route   POST /api/users/login
// @access  Public

exports.loginUser = (req, res) => {

    const {
        email,
        password
    } = req.body;


    /*---------------------------------------------
                    VALIDATION
    ---------------------------------------------*/

    if (
        !email ||
        !password
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required"

        });

    }


    /*---------------------------------------------
                    FIND USER
    ---------------------------------------------*/

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


            if (
                results.length === 0
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            const user =
                results[0];


            /*-----------------------------------------
                        CHECK PASSWORD
            -----------------------------------------*/

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


            /*-----------------------------------------
                        CREATE JWT
            -----------------------------------------*/

            const token =
                jwt.sign(

                    {
                        id: user.id,

                        email: user.email
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "24h"
                    }

                );


            /*-----------------------------------------
                        RESPONSE
            -----------------------------------------*/

            return res.status(200).json({

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


/*=========================================================
                    GET PROFILE
=========================================================*/

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private

exports.getProfile = (req, res) => {

    try {

        /*
            protect middleware puts
            the logged-in user's ID
            inside req.user
        */

        const userId =
            req.user;


        /*---------------------------------------------
                    FIND USER
        ---------------------------------------------*/

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


                if (
                    results.length === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "User not found"

                    });

                }


                /*-----------------------------------------
                        REMOVE PASSWORD
                -----------------------------------------*/

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

        console.error(
            "Get Profile Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


/*=========================================================
                    UPDATE PROFILE
=========================================================*/

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private

exports.updateProfile = async (req, res) => {

    try {

        /*
            User ID comes from JWT
        */

        const userId =
            req.user;


        /*
            Data coming from frontend
        */

        const {
            full_name,
            bio,
            location
        } = req.body;


        /*---------------------------------------------
                    VALIDATION
        ---------------------------------------------*/

        if (!full_name || !full_name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Full name is required"

            });

        }


        if (full_name.trim().length < 2) {

            return res.status(400).json({

                success: false,

                message:
                    "Full name must contain at least 2 characters"

            });

        }


        /*---------------------------------------------
                    UPDATE DATABASE
        ---------------------------------------------*/

        User.updateProfile(

            userId,

            {
                full_name:
                    full_name.trim(),

                bio:
                    bio
                        ? bio.trim()
                        : null,

                location:
                    location
                        ? location.trim()
                        : null

            },

            (err, result) => {

                if (err) {

                    console.error(
                        "Update Profile DB Error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error while updating profile"

                    });

                }


                /*-----------------------------------------
                        CHECK USER EXISTS
                -----------------------------------------*/

                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "User not found"

                    });

                }


                /*-----------------------------------------
                        GET UPDATED USER
                -----------------------------------------*/

                User.findUserById(

                    userId,

                    (findErr, results) => {

                        if (findErr) {

                            console.error(
                                findErr
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Profile updated but unable to fetch updated data"

                            });

                        }


                        if (
                            results.length === 0
                        ) {

                            return res.status(404).json({

                                success: false,

                                message:
                                    "User not found after update"

                            });

                        }


                        const {
                            password,
                            ...userData
                        } = results[0];


                        return res.status(200).json({

                            success: true,

                            message:
                                "Profile updated successfully",

                            user:
                                userData

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while updating profile"

        });

    }

};