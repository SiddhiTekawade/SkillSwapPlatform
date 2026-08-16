const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    uploadProfileImage
} = require("../controllers/userController");

const { protect } =
    require("../middleware/authMiddleware");

const multer = require("multer");

const path = require("path");

const router = express.Router();


// =====================================================
//                    MULTER CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            path.join(__dirname, "../uploads")
        );

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(
            null,
            uniqueName
        );

    }

});


// =====================================================
//                    FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );

    }

};


const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});


// =====================================================
//                    PUBLIC ROUTES
// =====================================================

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


// =====================================================
//                    PROTECTED ROUTES
// =====================================================

// Get logged-in user's profile

router.get(
    "/profile",
    protect,
    getProfile
);


// =====================================================
//                PROFILE IMAGE UPLOAD
// =====================================================

// Upload / update profile image

router.put(
    "/profile/image",
    protect,
    upload.single("profile_image"),
    uploadProfileImage
);


module.exports = router;