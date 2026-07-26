
/// backend/models/userModel.js
const db = require("../config/db");

const User = {
    // 1. Fetch all users/profiles
    getAll: (callback) => {
        db.query("SELECT id, full_name, email, bio, location, profile_image FROM users", callback);
    },

    // 2. Securely insert registration records
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

    // 3. Find user by email for Login
    findUserByEmail: (email, callback) => {
        const query = "SELECT * FROM users WHERE email =?";
        db.query(query, [email], callback);
    },

    // 4. NEW: Find user by ID for Profile - Day 7
    findUserById: (id, callback) => {
        const query = "SELECT id, full_name, email, bio, location, profile_image FROM users WHERE id =?";
        db.query(query, [id], callback);
    }
};

module.exports = User;