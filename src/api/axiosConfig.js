

// import axios from 'axios';

// const axiosBase = axios.create({
//   // locan instance 
//    baseURL: 'http://localhost:5000/api',
  
//   // deployed version of WebGL2RenderingContext.com
//    baseURL: 'https://evangadiforum-backend-deploy-k1x8.onrender.com/'
//    });

// // Attach token to every request if available
// axiosBase.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     console.log('Injecting token:', token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosBase;

// src/api/axiosConfig.js
import axios from 'axios';

const axiosBase = axios.create({
  // baseURL for deployed backend with /api prefix
    baseURL: 'https://evangadiforum-backend-deploy-2-atdb.onrender.com/api' 
});

// Attach token to every request if available
axiosBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
   // console.log('Injecting token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosBase;
