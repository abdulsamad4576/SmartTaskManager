import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  getCategories,
  addCategory,
  login,
  register
} from './api/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CategoryFilter from './components/CategoryFilter';
import ReminderModal from './components/ReminderModal';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MainLayout from './components/MainLayout';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reminderTask, setReminderTask] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [sortByDeadline, setSortByDeadline] = useState('none'); // 'none', 'asc', 'desc'
  const [completionFilter, setCompletionFilter] = useState('all'); // 'all', 'completed', 'incomplete'
  const notifiedTaskIdsRef = useRef(new Set());

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

  // Auth handlers
  const handleLogin = async (creds) => {
    setAuthError('');
    try {
      const res = await login(creds);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      const payload = JSON.parse(atob(res.data.token.split('.')[1]));
      setUser(payload.username);
      localStorage.setItem('user', payload.username);
      setIsAuthChecking(false);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (creds) => {
    setAuthError('');
    try {
      await register(creds);
      setAuthMode('login');
      setAuthError('Registration successful! Please log in.');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthChecking(false);
  };

  // Helper to handle 401 errors
  const handleApiError = (err) => {
    if (err.response && err.response.status === 401) {
      handleLogout();
    }
  };

  // Only fetch data if authenticated
  useEffect(() => {
    if (token) {
      setIsAuthChecking(false);
      fetchCategories().catch(handleApiError);
      fetchTasks().catch(handleApiError);
    } else {
      setIsAuthChecking(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTasks(filterCategory).catch(handleApiError);
    }
  }, [filterCategory, token]);

  // Periodically check for tasks with deadlines within 30 minutes
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const in30Min = new Date(now.getTime() + 30 * 60 * 1000);
      
      // Only check for new reminders if no reminder is currently showing
      if (!reminderTask) {
        for (const task of tasks) {
          if (
            task.deadline &&
            !task.completed &&
            !notifiedTaskIdsRef.current.has(task._id)
          ) {
            const deadline = new Date(task.deadline);
            console.log('Debug - Original:', task.deadline, 'Parsed as local:', deadline);
            const deadlineStr = deadline.toISOString().replace('Z', '').replace(/\.\d{3}$/, '');
            //const deadline = new Date(deadlineStr);
            const deadlineFinal = new Date(deadlineStr);
            console.log('Debug - Deadline string:', deadlineStr);
            if (deadlineFinal > now && deadlineFinal <= in30Min) {
              setReminderTask(task);
              notifiedTaskIdsRef.current.add(task._id);
              break;
            }
          }
        }
      }
    };
    
    // Initial check
    checkDeadlines();
    
    // Set up interval for periodic checks
    const interval = setInterval(checkDeadlines, 60 * 1000); // Check every minute
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [tasks]); // Only depend on tasks changing

  // Add or update task
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await addTask(taskData);
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks(filterCategory);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks(filterCategory);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Mark as completed/uncompleted
  const handleToggleTask = async (id) => {
    try {
      await completeTask(id);
      fetchTasks(filterCategory);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
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

  const handleCloseReminder = () => setReminderTask(null);

  // Sort tasks by deadline
  const handleSortByDeadline = () => {
    const nextSort = sortByDeadline === 'none' ? 'asc' : sortByDeadline === 'asc' ? 'desc' : 'none';
    setSortByDeadline(nextSort);
  };

  // Filter tasks by completion status
  const handleCompletionFilter = () => {
    const nextFilter = completionFilter === 'all' ? 'incomplete' : completionFilter === 'incomplete' ? 'completed' : 'all';
    setCompletionFilter(nextFilter);
  };

  // Get sorted and filtered tasks
  const getSortedTasks = () => {
    let filteredTasks = tasks;
    
    // Apply completion filter
    if (completionFilter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    } else if (completionFilter === 'incomplete') {
      filteredTasks = tasks.filter(task => !task.completed);
    }
    
    // Apply sorting
    if (sortByDeadline === 'none') return filteredTasks;
    
    return [...filteredTasks].sort((a, b) => {
      // Tasks without deadlines go to the end
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      
      return sortByDeadline === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  // Loading state
  if (isAuthChecking) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            !token ? (
              <LoginForm 
                onLogin={handleLogin} 
                error={authError} 
                onClearError={() => setAuthError('')}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !token ? (
              <RegisterForm 
                onRegister={handleRegister} 
                error={authError} 
                onClearError={() => setAuthError('')}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected main app route */}
        <Route
          path="/"
          element={
            token ? (
              <MainLayout
                user={user}
                onLogout={handleLogout}
                tasks={getSortedTasks()}
                categories={categories}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                loading={loading}
                showForm={showForm}
                editingTask={editingTask}
                onAddTask={handleAddTask}
                onSaveTask={handleSaveTask}
                onCancelForm={handleCancelForm}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onCompleteTask={handleToggleTask}
                sortByDeadline={sortByDeadline}
                onSortByDeadline={handleSortByDeadline}
                completionFilter={completionFilter}
                onCompletionFilter={handleCompletionFilter}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Reminder Modal */}
      <ReminderModal task={reminderTask} onClose={handleCloseReminder} />
    </Router>
  );
}

export default App;
