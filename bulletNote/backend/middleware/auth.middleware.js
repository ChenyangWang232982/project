require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.note_token;
    console.log('Received token:', token);
    if (!token) {
      console.log('No token found in cookies');  
      return res.status(401).json({ success: false, message: 'Unauthorized, please log in first.' });
    }
    console.log('Token found, verifying...');
    console.log('JWT_SECRET:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded);
    req.user = { id: decoded.id, username: decoded.username };
    console.log('Token verified successfully, user info attached to request:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.name, err.message);
    const msg = err.name === 'TokenExpiredError' ? 'Login expired, please re-login.' : 'Invalid token, please re-login.';
    return res.status(401).json({ success: false, message: msg });
  }
};

module.exports = { protect };