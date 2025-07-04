import React, { useEffect, useState, useRef } from 'react';
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

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reminderTask, setReminderTask] = useState(null);
  const notifiedTaskIdsRef = useRef(new Set());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login'); // or 'register'
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [isAuthChecking, setIsAuthChecking] = useState(true);

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
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTasks(filterCategory).catch(handleApiError);
    }
  }, [filterCategory, token]);

  // Periodically check for tasks with deadlines within 30 minutes
  useEffect(() => {
    const checkDeadlines = () => {
      if (reminderTask) return; // Only show one reminder at a time
      const now = new Date();
      const in30Min = new Date(now.getTime() + 30 * 60 * 1000);
      for (const task of tasks) {
        if (
          task.deadline &&
          !task.completed &&
          !notifiedTaskIdsRef.current.has(task._id)
        ) {
          const deadline = new Date(task.deadline);
          if (deadline > now && deadline <= in30Min) {
            setReminderTask(task);
            notifiedTaskIdsRef.current.add(task._id);
            break;
          }
        }
      }
    };
    checkDeadlines();
    const interval = setInterval(checkDeadlines, 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, reminderTask]);

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

  const handleCloseReminder = () => setReminderTask(null);

  if (isAuthChecking) {
    return <div style={{ textAlign: 'center', marginTop: 80 }}><b>Loading...</b></div>;
  }
  if (!token) {
    return authMode === 'login' ? (
      <>
        <LoginForm onLogin={handleLogin} error={authError} />
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span>Don't have an account? </span>
          <button onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Register</button>
        </div>
      </>
    ) : (
      <>
        <RegisterForm onRegister={handleRegister} error={authError} />
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span>Already have an account? </span>
          <button onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Login</button>
        </div>
      </>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fafafa', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Smart Task Manager</h1>
        <div>
          <span style={{ marginRight: 12 }}>Hello, {user}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
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
      <ReminderModal task={reminderTask} onClose={handleCloseReminder} />
    </div>
  );
}

export default App;
