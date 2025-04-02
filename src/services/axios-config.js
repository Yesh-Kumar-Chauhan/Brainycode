import axios from 'axios';

//export  const BASE_URL = "http://localhost:8000/api";
export const BASE_URL = "https://g9l4lqqav3.execute-api.us-east-1.amazonaws.com/prod/api"; //old console
//export  const BASE_URL = "https://xaa3a9p3t3.execute-api.us-east-1.amazonaws.com/prod/api"; //new console
// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  timeout : 300000
});

// Function to get the token
const getToken = () => {
  return localStorage.getItem('token') ; // Replace with your token retrieval logic
};

// Interceptor to add token to every request except sign-in and sign-up
axiosInstance.interceptors.request.use(
  config => {
    const token = getToken();
    const isAuthRoute = config.url.includes('/signin') || config.url.includes('/signup');

    if (token && !isAuthRoute) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
