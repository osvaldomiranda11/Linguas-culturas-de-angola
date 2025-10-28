import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

instance.interceptors.response.use((r) => r, (err) => {
  if (err.response && err.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }
  return Promise.reject(err);
});

export default instance;
