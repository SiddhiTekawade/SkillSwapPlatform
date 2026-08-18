const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*=========================================================
                UPLOAD DIRECTORY
=========================================================*/

const uploadDirectory = path.join(
    __dirname,
    "../uploads"
);


/*=========================================================
                CREATE DIRECTORY
=========================================================*/

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


/*=========================================================
                STORAGE CONFIGURATION
=========================================================*/

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadDirectory
        );

    },


    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname)
                .toLowerCase();


        /*
            Example filename:

            user-5-1722345678901.jpg

            This prevents users from
            accidentally overwriting
            another user's image.
        */

        const userId =
            req.user;

        const fileName =
            `user-${userId}-${Date.now()}${extension}`;


        cb(
            null,
            fileName
        );

    }

});


/*=========================================================
                FILE VALIDATION
=========================================================*/

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"

    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

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


/*=========================================================
                MULTER CONFIGURATION
=========================================================*/

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});


module.exports = upload;