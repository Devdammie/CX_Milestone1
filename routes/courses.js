const express = require('express');
const Course = require('../models/Course');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Create a course (instructors only)
router.post('/', auth, requireRole('instructor'), async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = await Course.create({
      title,
      description,
      instructor: req.user._id
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: 'Course creation failed' });
  }
});

// Get all courses (anyone)
router.get('/', async (req, res) => {
  const courses = await Course.find().populate('instructor', 'username');
  res.json(courses);
});

module.exports = router;
