
// src/api/axiosConfig.js
import axios from 'axios';

const axiosBase = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL
});

// Attach token to every request if available
axiosBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosBase;

