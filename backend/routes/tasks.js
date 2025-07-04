const express = require('express');
const Task = require('../models/Task');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

// All routes below require authentication
router.use(auth);

// GET /tasks?category=...&deadline=...
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user.userId };
    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category });
      if (category) filter.category = category._id;
    }
    if (req.query.deadline) {
      filter.deadline = { $lte: new Date(req.query.deadline) };
    }
    const tasks = await Task.find(filter).populate('category');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline, completed, category } = req.body;
    let categoryId = null;
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) categoryId = cat._id;
    }
    const task = new Task({
      title,
      description,
      deadline,
      completed,
      category: categoryId,
      user: req.user.userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, deadline, completed, category } = req.body;
    let categoryId = null;
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) categoryId = cat._id;
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description, deadline, completed, category: categoryId },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { completed: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 