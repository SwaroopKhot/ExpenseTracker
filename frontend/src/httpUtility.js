
import axios from "axios"
const url = process.env.REACT_APP_BACKEND_URL // Used only when development is required

const httpInstance = axios.create({
    baseURL: url, // Set your API base URL
    timeout: 5000, // Request timeout
    headers: {
      'Content-Type': 'application/json',
    },
});

// Add a request interceptor
httpInstance.interceptors.request.use(
    (config) => {
      const token = "DFDF" // JWT token can be added here !
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
  

// Response interceptor to handle errors
httpInstance.interceptors.response.use(
  (response) => response,
  (error) => {
      // Handle errors globally
      if (error.response) {
          if (error.response.status === 401) {
              // Token expired or invalid, handle logout or token refresh
              console.error('Unauthorized access - Token expired or invalid');
              window.location.href = "/"
              // You can redirect to login page here
          } else if (error.response.status === 403) {
              // Forbidden, handle accordingly
              console.error('Forbidden access');
          } else {
              console.error('HTTP Error:', error.response.data || error.message);
          }
      } else {
          console.error('Network Error:', error.message);
      }
      return Promise.reject(error);
  }
);

export default httpInstance;