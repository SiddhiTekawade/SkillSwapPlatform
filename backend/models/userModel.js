/*
const db = require("../config/db");

const User = {
    // This function handles the raw MySQL query
    getAll: (callback) => {
        db.query("SELECT * FROM users", callback);
    }
};

module.exports = User;
*/

/// backend/models/userModel.js
const db = require("../config/db");

const User = {
    // 1. Existing function to fetch all users/profiles
    getAll: (callback) => {
        db.query("SELECT * FROM users", callback);
    },

    // 2. Step 1 & 2: Securely insert registration records
    // password madhe bcrypt hash yeil
    create: (userData, callback) => {
        const query = `
            INSERT INTO users (full_name, email, password, bio, location)
            VALUES (?,?,?,?,?)
        `;

        const values = [
            userData.full_name,
            userData.email,
            userData.password, // hash password
            userData.bio || null,
            userData.location || null
        ];

        db.query(query, values, callback);
    },

    // 3. Step 4: New function - Find user by email for Login
    findUserByEmail: (email, callback) => {
        const query = "SELECT * FROM users WHERE email =?";
        db.query(query, [email], callback);
    }
};

module.exports = User;