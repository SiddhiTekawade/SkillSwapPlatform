const User = require("../models/userModel");

exports.getUsers = (req, res) => {
    // Calling the function we just created inside userModel.js
    User.getAll((err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};