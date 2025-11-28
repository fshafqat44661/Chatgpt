import axios from "axios";
// import { toast } from "react-toastify";

// Utility function to make API requests (no authentication required)
const apiRequest = async (method, url, data = {}, token = null, headers = {}) => {
  const config = {
    method: method.toLowerCase(), // Normalize method to lowercase
    url: `${process.env.REACT_APP_API_BASE_URL}${url}`, // Correct URL concatenation
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Only add auth header if token exists
      ...headers,
    },
  };

  // Handle data or params based on request method
  switch (method.toLowerCase()) {
    case "get":
    case "delete":
      config.params = data; // For GET and DELETE requests, use params
      break;
    case "post":
    case "put":
    case "patch":
      config.data = data; // For POST, PUT, and PATCH requests, use data
      break;
    default:
      throw new Error(`Unsupported request method: ${method}`); // Fixed error string
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    throw error;
  }
};

export default apiRequest;
