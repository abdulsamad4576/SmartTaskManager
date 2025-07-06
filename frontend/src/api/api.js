import axios from 'axios';

const API_BASE_URL = 'https://smart-task-manager-backend-3du9.onrender.com/'; 
// const API_BASE_URL = 'localhost:5000'; // Keep localhost for development


const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Task APIs
export const getTasks = (params) => api.get('/tasks', { params });
export const addTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`);

// Category APIs
export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Attach JWT token to all requests if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 