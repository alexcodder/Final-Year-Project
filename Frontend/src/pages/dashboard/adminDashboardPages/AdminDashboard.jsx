import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaAmbulance, FaHospital, FaTint, FaSignOutAlt, FaUsers, FaSpinner } from 'react-icons/fa';
import UserManagement from './UserManagement';
import { logout, getUserRole, getUsername } from '../../../utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Get user info from utility functions
    setUserRole(getUserRole());
    setUsername(getUsername());
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    // Enable loading state
    setIsLoggingOut(true);
    
    try {
      // Use the centralized logout function
      await logout();
      // No need to navigate here as logout() will redirect
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: force redirect to login in case of error
      window.location.href = '/login';
    }
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'dashboard':
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome to the Admin Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <FaUsers />
                <h3>Total Users</h3>
                <p>150</p>
              </div>
              <div className="stat-card">
                <FaAmbulance />
                <h3>Ambulances</h3>
                <p>25</p>
              </div>
              <div className="stat-card">
                <FaHospital />
                <h3>Hospitals</h3>
                <p>15</p>
              </div>
              <div className="stat-card">
                <FaTint />
                <h3>Blood Banks</h3>
                <p>10</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Welcome, {username}</p>
          <span className="user-role">{userRole}</span>
        </div>
        <div className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <FaUser />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaUsers />
            <span>User Management</span>
          </button>
        </div>
        <div className="sidebar-footer">
          <button 
            className="logout-button" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <FaSpinner className="fa-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <FaSignOutAlt />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="main-content">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default AdminDashboard; 