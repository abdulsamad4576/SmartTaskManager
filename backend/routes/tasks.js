const express = require('express');
const Task = require('../models/Task');
const Category = require('../models/Category');

const router = express.Router();

// GET /tasks?category=...&deadline=...
router.get('/', async (req, res) => {
  try {
    const filter = {};
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
    res.status(500).json({ error: err.message });
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
    const task = new Task({ title, description, deadline, completed, category: categoryId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline, completed, category: categoryId },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 