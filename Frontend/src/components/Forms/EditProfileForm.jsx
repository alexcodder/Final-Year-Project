import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const EditProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.withCredentials = true;

        const response = await axios.get('http://localhost:3001/api/v1/patient-history/profile');
        const { firstName, lastName, email } = response.data.data;

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email
        }));
      } catch (err) {
        setError('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords if they are provided
    if (formData.password || formData.confirmPassword) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Both password fields are required if you want to change your password');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (!validatePassword(formData.password)) {
        setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await axios.post('http://localhost:3001/api/v1/patient-history/update', updateData);
      
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="update-profile-container">
      <div className="update-profile-header">
        <h2>Edit Profile</h2>
        <p>Update your personal information</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3><FaUser /> Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><FaLock /> Change Password</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate('/profile')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm; 