import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Register a new user
 * @param {string} username - The username
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - The response data
 */
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Registration failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

/**
 * Login a user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - The response data
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Login failed');
    }
    throw new Error('Network error. Please try again.');
  }
}; 