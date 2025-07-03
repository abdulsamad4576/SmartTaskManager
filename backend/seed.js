require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');
const Category = require('./models/Category');
const fs = require('fs');
const path = require('path');

const MONGODB_URL = process.env.MONGODB_URL;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Load sample data
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample_data.json'), 'utf-8'));

    // Clear existing data
    await Task.deleteMany({});
    await Category.deleteMany({});

    console.log("Tasks: ", Task);
    console.log("Categories: ", Category);
    // Insert categories
    const categoryDocs = await Category.insertMany(data.categories);
    const categoryMap = {};
    categoryDocs.forEach(cat => { categoryMap[cat.name] = cat._id; });

    // Insert tasks with correct category references
    const tasksWithCategory = data.tasks.map(task => ({
      ...task,
      category: categoryMap[task.category] || null
    }));
    await Task.insertMany(tasksWithCategory);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 