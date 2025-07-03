const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(cors());
app.use(express.json());

// Placeholder root route
app.get('/', (req, res) => {
  res.send('Smart Task Manager API');
});

app.use('/tasks', tasksRouter);
app.use('/categories', categoriesRouter);

module.exports = app; 