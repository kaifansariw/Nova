import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authConfig } from '../config/auth.js';
import { tokenBlacklist } from '../middleware/auth.js';

const generateToken = (id) => {
  return jwt.sign({ id }, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiration
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, organization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email address already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      organization: organization || 'Nova Workspace',
      role: 'owner'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  if (req.token) {
    tokenBlacklist.add(req.token);
  }
  res.json({ message: 'Successfully logged out.' });
};

export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      organization: req.user.organization,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt
    }
  });
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, organization, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (organization !== undefined) user.organization = organization;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
};
