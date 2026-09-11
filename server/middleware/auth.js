import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';
import { User } from '../models/User.js';

// In-memory blacklist for logged-out tokens
export const tokenBlacklist = new Set();

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};
