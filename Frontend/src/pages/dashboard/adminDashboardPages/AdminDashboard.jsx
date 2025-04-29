import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaAmbulance, 
  FaHospital, 
  FaTint, 
  FaSignOutAlt, 
  FaUsers, 
  FaSpinner,
  FaChartLine,
  FaHistory,
  FaCog
} from 'react-icons/fa';
import UserManagement from './UserManagement';
import { logout, getUserRole, getUsername } from '../../../utils/auth';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    ambulances: 0,
    hospitals: 0,
    bloodBanks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user info from utility functions
    setUserRole(getUserRole());
    setUsername(getUsername());
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, ambulancesRes, hospitalsRes, bloodBanksRes] = await Promise.all([
        axios.get('/api/v1/users'),
        axios.get('/api/v1/ambulances'),
        axios.get('/api/v1/hospitals'),
        axios.get('/api/v1/blood-banks')
      ]);

      setStats({
        totalUsers: usersRes.data.data.length,
        ambulances: ambulancesRes.data.data.length,
        hospitals: hospitalsRes.data.data.length,
        bloodBanks: bloodBanksRes.data.data.length
      });
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    }
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return (
          <div className="dashboard-content">
            <h2>Analytics Dashboard</h2>
            <div className="analytics-grid">
              {/* Add analytics charts and graphs here */}
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="dashboard-content">
            <h2>Patient History</h2>
            {/* Add patient history table here */}
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-content">
            <h2>System Settings</h2>
            {/* Add settings form here */}
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome to the Admin Dashboard</h2>
            {loading ? (
              <div className="loading-spinner">
                <FaSpinner className="fa-spin" />
                <span>Loading statistics...</span>
              </div>
            ) : error ? (
              <div className="error-message">
                {error}
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <FaUsers />
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <FaAmbulance />
                  <h3>Ambulances</h3>
                  <p>{stats.ambulances}</p>
                </div>
                <div className="stat-card">
                  <FaHospital />
                  <h3>Hospitals</h3>
                  <p>{stats.hospitals}</p>
                </div>
                <div className="stat-card">
                  <FaTint />
                  <h3>Blood Banks</h3>
                  <p>{stats.bloodBanks}</p>
                </div>
              </div>
            )}
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
          <button
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <FaChartLine />
            <span>Analytics</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSection('history')}
          >
            <FaHistory />
            <span>Patient History</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <FaCog />
            <span>Settings</span>
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