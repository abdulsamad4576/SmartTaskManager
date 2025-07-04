import React, { useEffect, useState } from 'react';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  getCategories,
  addCategory
} from './api/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CategoryFilter from './components/CategoryFilter';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  // Fetch tasks
  const fetchTasks = async (category = '') => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    const res = await getTasks(params);
    setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchTasks(filterCategory);
  }, [filterCategory]);

  // Add or update task
  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
    } else {
      await addTask(taskData);
    }
    setShowForm(false);
    setEditingTask(null);
    fetchTasks(filterCategory);
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks(filterCategory);
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Mark as completed
  const handleCompleteTask = async (id) => {
    await completeTask(id);
    fetchTasks(filterCategory);
  };

  // Add new task
  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fafafa', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <h1>Smart Task Manager</h1>
      <CategoryFilter
        categories={categories}
        value={filterCategory}
        onChange={setFilterCategory}
      />
      <button onClick={handleAddTask} style={{ marginBottom: 16 }}>Add Task</button>
      {showForm && (
        <TaskForm
          onSubmit={handleSaveTask}
          categories={categories}
          initialData={editingTask}
          onCancel={handleCancelForm}
        />
      )}
      {loading ? <p>Loading...</p> : (
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
        />
      )}
    </div>
  );
}

export default App;
