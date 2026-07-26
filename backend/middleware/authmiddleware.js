const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // User model import kara

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Token madhun id gheun DB madhun full user kadha
            User.findUserById(decoded.id, (err, results) => {
                if(err) {
                    return res.status(500).json({ success: false, message: "Database error" });
                }
                if(results.length === 0) {
                    return res.status(401).json({ success: false, message: "Not authorized, user not found" });
                }
                
                req.user = results[0].id; // DB madhun aalela id tak
                next();
            });

        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protect };