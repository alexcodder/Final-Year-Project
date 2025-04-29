import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaAmbulance, FaHospital, FaTint } from "react-icons/fa";

function DashboardAmbulance() {
  const [ambulanceData, setAmbulanceData] = useState(null);
  const [emergencyCalls, setEmergencyCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAmbulanceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/ambulance/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setAmbulanceData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching ambulance data:", error);
        setError("Failed to load ambulance data");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmergencyCalls = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/emergency/active",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setEmergencyCalls(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching emergency calls:", error);
      }
    };

    fetchAmbulanceData();
    fetchEmergencyCalls();
  }, []);

  if (loading) {
    return <div className="loading">Loading ambulance data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard ambulance-dashboard">
      <div className="dashboard-header">
        <h1>Ambulance Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/ambulance/profile" className="btn primary">
            Update Profile
          </Link>
          <Link to="/ambulance/status" className="btn secondary">
            Update Status
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Ambulance Information</h2>
          {ambulanceData && (
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Vehicle Number:</span>
                <span className="value">{ambulanceData.vehicleNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Driver:</span>
                <span className="value">{ambulanceData.driverName}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{ambulanceData.phoneNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className={`status ${ambulanceData.status}`}>
                  {ambulanceData.status}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Active Emergency Calls</h2>
          <div className="emergency-calls-list">
            {emergencyCalls.length > 0 ? (
              emergencyCalls.map((call) => (
                <div key={call._id} className="emergency-call-card">
                  <div className="call-info">
                    <span className="location">
                      {call.location.address}
                    </span>
                    <span className="patient-name">
                      {call.patientName}
                    </span>
                    <span className="condition">
                      {call.condition}
                    </span>
                  </div>
                  <div className="call-actions">
                    <button
                      className="btn accept"
                      onClick={() => handleAcceptCall(call._id)}
                    >
                      Accept Call
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => handleRejectCall(call._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No active emergency calls</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/ambulance/map" className="btn primary">
              View Map
            </Link>
            <Link to="/ambulance/history" className="btn secondary">
              Call History
            </Link>
            <Link to="/ambulance/reports" className="btn secondary">
              Generate Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component
function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      {icon}
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default DashboardAmbulance;
