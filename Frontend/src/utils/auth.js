/**
 * Authentication utilities for handling login, logout, and session management
 */
import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:3001/api/v1';

// Configure axios to include credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Set token in axios defaults and localStorage
export const setAuthToken = (token) => {
  if (token) {
    // Remove any whitespace and ensure proper Bearer format
    const formattedToken = token.trim();
    const bearerToken = formattedToken.startsWith('Bearer ') ? formattedToken : `Bearer ${formattedToken}`;
    
    // Set in axios defaults
    axios.defaults.headers.common['Authorization'] = bearerToken;
    
    // Store in localStorage
    localStorage.setItem('token', formattedToken);
    
    console.log('Token set successfully:', bearerToken);
  } else {
    // Remove token from axios defaults and localStorage
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    console.log('Token cleared');
  }
};

// Clear all auth-related data from the browser
export const clearAuthData = () => {
  // Clear localStorage items
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  
  // Clear axios defaults
  delete axios.defaults.headers.common['Authorization'];
  
  console.log('Auth data cleared');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Server-side logout
const logoutFromServer = async () => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    console.error('Server logout failed:', error);
    return false;
  }
};

// Perform complete logout (both client and server) and redirect
export const logout = async () => {
  // Try server-side logout first (clear JWT cookie on server)
  await logoutFromServer();
  
  // Then clear client-side data regardless of server response
  clearAuthData();
  
  // Redirect to home page
  window.location.href = '/';
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('role') || '';
};

// Get username
export const getUsername = () => {
  return localStorage.getItem('username') || 'User';
};

export default api; 