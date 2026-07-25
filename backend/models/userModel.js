const db = require("../config/db");

const User = {
    // This function handles the raw MySQL query
    getAll: (callback) => {
        db.query("SELECT * FROM users", callback);
    }
};

module.exports = User;