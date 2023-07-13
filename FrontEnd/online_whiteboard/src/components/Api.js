import React from 'react';
import axios from 'axios';
import Toasts from './Toasts';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const registerUser = (userData) => {
  return api.post('/register', userData)
    .then((response) => {
      // Display success toast
      showToast('success', 'Success', 'User registered successfully');
      return response;
    })
    .catch((error) => {
      // Display error toast
      showToast('error', 'Error', 'Failed to register user');
      throw error;
    });
};

const loginUser = (userData) => {
  return api.post('/login', userData)
    .then((response) => {
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      // Save cookies from the response
            // Display success toast
      showToast('success', 'Success', 'User logged in successfully');
      console.log(response.data)
      return response.data;
      
    })
    .catch((error) => {
      // Display error toast
      showToast('error', 'Error', 'Failed to login user');
      throw error;
    });
};

const logoutUser = () => {
  localStorage.removeItem('authToken');

  // Additional logout actions if needed

  // Display success toast
  showToast('success', 'Success', 'User logged out successfully');
};

const saveCookies = (cookies) => {
  // Save the cookies to localStorage or other storage mechanism
  // Here's an example of how to save them to localStorage
  localStorage.setItem('cookies', JSON.stringify(cookies));
};

const getCanvasData = async () => {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await api.get('/canvas', {
      headers,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Failed to fetch canvas data:', error);
    // Display error toast
    showToast('error', 'Error', 'Failed to fetch canvas data');
    throw error;
  }
};

const saveCanvasData = async (data) => {
  const token = localStorage.getItem('authToken');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await api.post('/canvas', data, { headers });
    console.log(response);
    // Display success toast
    showToast('success', 'Success', 'Canvas data saved successfully');
  } catch (error) {
    console.error('Failed to save the canvas:', error, data);
    // Display error toast
    showToast('error', 'Error', 'Failed to save canvas data');
  }
};

const showToast = (type, message, description) => {
  // Create a toast component and display it
  const toastElement = (
    <Toasts type={type} message={message} description={description} />
  );
  // Render the toast component in your desired location (e.g., using ReactDOM.render)
  // Make sure you have a container for the toasts in your application
};

const Api = {
  registerUser,
  loginUser,
  logoutUser,
  saveCanvasData,
  getCanvasData,
};

export default Api;
