import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHistory, FaEdit, FaSignOutAlt, FaHome, FaHeartbeat, FaRunning, FaCalendarAlt, FaFileMedical, FaUserMd } from "react-icons/fa";

function PatientProfile() {
  const [patientData, setPatientData] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.defaults.withCredentials = true;
        }

        const [profileResponse, historyResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/v1/patient-history/profile"),
          axios.get("http://localhost:3001/api/v1/patient-history/history")
        ]);

        if (profileResponse.data.success) {
          setPatientData(profileResponse.data.data);
        }

        if (historyResponse.data.success) {
          setMedicalHistory(historyResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError(error.response?.data?.message || "Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="btn primary">
          Try Again
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="dashboard-overview">
            <div className="welcome-section">
              <div className="welcome-card">
                <div className="welcome-content">
                  <h2>Welcome back, {patientData?.firstName ? `${patientData.firstName} ${patientData.lastName || ''}` : "Patient"}!</h2>
                  <p>Here's your health dashboard overview</p>
                </div>
                <div className="welcome-actions">
                  <Link to="/patient/profile/edit" className="btn primary">
                    <FaEdit /> Edit Profile
                  </Link>
                  <Link to="/patient-history/edit" className="btn secondary">
                    <FaEdit /> Update Medical History
                  </Link>
                </div>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaFileMedical />
                </div>
                <div className="stat-info">
                  <h3>Medical Records</h3>
                  <p>Complete</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaCalendarAlt />
                </div>
                <div className="stat-info">
                  <h3>Next Appointment</h3>
                  <p>Not Scheduled</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUserMd />
                </div>
                <div className="stat-info">
                  <h3>Last Checkup</h3>
                  <p>Not Available</p>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Name</span>
                    <span className="value">{patientData?.firstName ? `${patientData.firstName} ${patientData.lastName || ''}` : 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Username</span>
                    <span className="value">{patientData?.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email</span>
                    <span className="value">{patientData?.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Role</span>
                    <span className="value">{patientData?.role}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Vital Statistics</h3>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Blood Group</span>
                    <span className="value">{medicalHistory?.bloodGroup}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Height</span>
                    <span className="value">{medicalHistory?.height} cm</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Weight</span>
                    <span className="value">{medicalHistory?.weight} kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "medical":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Medical Information</h2>
              <div className="section-actions">
                <Link to="/patient/history/edit" className="btn primary">
                  <FaEdit /> Update Medical Info
                </Link>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <div className="card-header">
                  <FaHeartbeat className="card-icon" />
                  <h3>Vital Statistics</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Blood Group</span>
                    <span className="value">{medicalHistory?.bloodGroup}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Height</span>
                    <span className="value">{medicalHistory?.height} cm</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Weight</span>
                    <span className="value">{medicalHistory?.weight} kg</span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>Contact Information</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Phone</span>
                    <span className="value">{medicalHistory?.phoneNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Address</span>
                    <span className="value">{medicalHistory?.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Medical History</h2>
              <div className="section-actions">
                <Link to="/patient/history/edit" className="btn primary">
                  <FaEdit /> Update History
                </Link>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <div className="card-header">
                  <FaFileMedical className="card-icon" />
                  <h3>Health Conditions</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Allergies</span>
                    <span className="value">
                      {medicalHistory?.allergies?.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Chronic Conditions</span>
                    <span className="value">
                      {medicalHistory?.chronicConditions?.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Past Surgeries</span>
                    <span className="value">
                      {medicalHistory?.pastSurgeries?.join(", ") || "None"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <div className="card-header">
                  <FaHistory className="card-icon" />
                  <h3>Medications & Family History</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Current Medications</span>
                    <span className="value">
                      {medicalHistory?.currentMedications?.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Family History</span>
                    <span className="value">
                      {medicalHistory?.familyHistory?.join(", ") || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "lifestyle":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Lifestyle Information</h2>
              <div className="section-actions">
                <Link to="/patient/history/edit" className="btn primary">
                  <FaEdit /> Update Lifestyle
                </Link>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <div className="card-header">
                  <FaRunning className="card-icon" />
                  <h3>Daily Habits</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Smoking</span>
                    <span className="value">{medicalHistory?.lifestyle?.smoking}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Alcohol</span>
                    <span className="value">{medicalHistory?.lifestyle?.alcohol}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Exercise</span>
                    <span className="value">{medicalHistory?.lifestyle?.exercise}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Diet</span>
                    <span className="value">{medicalHistory?.lifestyle?.diet}</span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>Additional Information</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="label">Sleep Pattern</span>
                    <span className="value">{medicalHistory?.lifestyle?.sleepPattern || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Stress Level</span>
                    <span className="value">{medicalHistory?.lifestyle?.stressLevel || "Not specified"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Patient Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            <FaHome className="nav-icon" />
            Overview
          </button>
          <button
            className={`nav-item ${activeSection === "medical" ? "active" : ""}`}
            onClick={() => setActiveSection("medical")}
          >
            <FaHeartbeat className="nav-icon" />
            Medical Info
          </button>
          <button
            className={`nav-item ${activeSection === "history" ? "active" : ""}`}
            onClick={() => setActiveSection("history")}
          >
            <FaHistory className="nav-icon" />
            Medical History
          </button>
          <button
            className={`nav-item ${activeSection === "lifestyle" ? "active" : ""}`}
            onClick={() => setActiveSection("lifestyle")}
          >
            <FaRunning className="nav-icon" />
            Lifestyle
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile; 