// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    
    const { name, email, password, role, adminSecret } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    let finalRole = 'user'; // Default to 'user'

    if (role === 'admin') {
      
      const SYSTEM_SECRET = 'ietp';

      if (adminSecret === SYSTEM_SECRET) {
        finalRole = 'admin'; // Approved!
      } else {
        return res
          .status(403)
          .json({ message: '❌ Security Alert: Invalid Admin Secret!' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Show them their actual role
        token: generateToken(user.id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
