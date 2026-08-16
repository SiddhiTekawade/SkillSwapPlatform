
// backend/models/userModel.js

const db = require("../config/db");


const User = {

    // =====================================================
    // 1. FETCH ALL USERS / PROFILES
    // =====================================================

    getAll: (callback) => {

        db.query(
            `
            SELECT
                id,
                full_name,
                email,
                bio,
                location,
                profile_image
            FROM users
            `,
            callback
        );

    },


    // =====================================================
    // 2. CREATE / REGISTER USER
    // =====================================================

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


    // =====================================================
    // 3. FIND USER BY EMAIL
    // =====================================================

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


    // =====================================================
    // 4. FIND USER BY ID
    // =====================================================

    findUserById: (id, callback) => {

        const query = `
            SELECT
                id,
                full_name,
                email,
                bio,
                location,
                profile_image
            FROM users
            WHERE id = ?
        `;


        db.query(
            query,
            [id],
            callback
        );

    },


    // =====================================================
    // 5. UPDATE PROFILE IMAGE
    // =====================================================

    updateProfileImage: (
        userId,
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
                userId
            ],
            callback
        );

    }

};


module.exports = User;