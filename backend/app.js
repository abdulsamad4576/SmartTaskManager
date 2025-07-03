const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Placeholder root route
app.get('/', (req, res) => {
  res.send('Smart Task Manager API');
});

module.exports = app; 