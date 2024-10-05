import axios from 'axios';
import { BASE_URL } from '../constants';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL from .env file
  timeout: 10000, // Set timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for request or response
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add tokens or modify request headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
