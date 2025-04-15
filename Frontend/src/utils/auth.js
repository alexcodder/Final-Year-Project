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

// Clear all auth-related data from the browser
export const clearAuthData = () => {
  // Clear localStorage items
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  
  // Clear JWT cookie
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
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