import axios from "axios";
import { BASE_URL } from "./constants";

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all requests
  timeout: 10000, // Timeout for requests (10 seconds)
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token"); // Get the token from local storage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Add the token to the request headers
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

export default axiosInstance; // Export the Axios instance for use in other parts of the application
