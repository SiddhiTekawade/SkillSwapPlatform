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

// backend/models/userModel.js
const db = require("../config/db");

const User = {
    // Existing function to fetch all profiles
    getAll: (callback) => {
        db.query("SELECT * FROM users", callback);
    },

    // New Day 5 function: Securely insert registration records
    create: (userData, callback) => {
        const query = `
            INSERT INTO users (full_name, email, password, bio, location) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Parameterized array mapping variables safely to placeholders
        const values = [
            userData.full_name,
            userData.email,
            userData.password, // This will be hashed later by bcrypt
            userData.bio || null,
            userData.location || null
        ];

        db.query(query, values, callback);
    }
};

module.exports = User;

