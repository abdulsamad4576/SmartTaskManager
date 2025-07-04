import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

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