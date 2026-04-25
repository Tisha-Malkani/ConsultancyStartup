import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const requestedRole = role === 'admin' ? 'admin' : 'user';
    if (requestedRole === 'admin') {
      const expectedCode = process.env.ADMIN_INVITE_CODE;
      if (!expectedCode) {
        return res.status(500).json({ error: 'Admin registration is not configured.' });
      }
      if (adminCode !== expectedCode) {
        return res.status(403).json({ error: 'Invalid admin invite code' });
      }
    }

    const user = await User.create({ name, email, password, role: requestedRole });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error during login' });
  }
};

export const getMe = async (req, res) => {
  const user = req.user;
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};
