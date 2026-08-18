// backend/models/userModel.js

const db = require("../config/db");


const User = {


    /*=========================================================
                        GET ALL USERS
    =========================================================*/

    getAll: (callback) => {

        const query = `
            SELECT
                id,
                full_name,
                email,
                bio,
                location,
                profile_image
            FROM users
        `;

        db.query(
            query,
            callback
        );

    },


    /*=========================================================
                        CREATE USER
    =========================================================*/

    create: (userData, callback) => {

        const query = `
            INSERT INTO users
            (
                full_name,
                email,
                password,
                bio,
                location
            )
            VALUES (?, ?, ?, ?, ?)
        `;


        const values = [

            userData.full_name,

            userData.email,

            userData.password,

            userData.bio || null,

            userData.location || null

        ];


        db.query(
            query,
            values,
            callback
        );

    },


    /*=========================================================
                    FIND USER BY EMAIL
    =========================================================*/

    findUserByEmail: (email, callback) => {

        const query = `
            SELECT *
            FROM users
            WHERE email = ?
        `;


        db.query(
            query,
            [email],
            callback
        );

    },


    /*=========================================================
                    FIND USER BY ID
    =========================================================*/

    findUserById: (id, callback) => {

        const query = `
            SELECT
                id,
                full_name,
                email,
                bio,
                location,
                profile_image,
                created_at
            FROM users
            WHERE id = ?
        `;


        db.query(
            query,
            [id],
            callback
        );

    },


    /*=========================================================
                    UPDATE USER PROFILE
    =========================================================*/

    updateProfile: (
        id,
        userData,
        callback
    ) => {

        const query = `
            UPDATE users
            SET
                full_name = ?,
                bio = ?,
                location = ?
            WHERE id = ?
        `;


        const values = [

            userData.full_name,

            userData.bio || null,

            userData.location || null,

            id

        ];


        db.query(
            query,
            values,
            callback
        );

    },


    /*=========================================================
                    UPDATE PROFILE IMAGE
                    (We'll use this later)
    =========================================================*/

    updateProfileImage: (
        id,
        profileImage,
        callback
    ) => {

        const query = `
            UPDATE users
            SET profile_image = ?
            WHERE id = ?
        `;


        db.query(
            query,
            [
                profileImage,
                id
            ],
            callback
        );

    }

};


module.exports = User;