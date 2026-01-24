const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

//Token validation
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.note_token;
        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized, please log in first.'
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            username: decoded.username
        };

        next();
    } catch(err) {
        console.error('Failure to verify token', err.message);
        return res.status(401).json({
            success: false,
            message: 'Your login has expired. Please log in again.'
        })
    }
};

module.exports = {protect};