const express = require('express');
const jwt = require('jsonwebtoken');
//const User = require('../models/User');
const User = require('../models/User');

const router = express.Router();
const { JWT_SECRET } = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!['student', 'instructor'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  try {
    const user = await User.create({ username, password, role });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
