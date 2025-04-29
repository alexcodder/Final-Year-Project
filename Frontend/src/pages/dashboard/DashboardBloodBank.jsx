import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DashboardBloodBank() {
  const [bloodBankData, setBloodBankData] = useState(null);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBloodBankData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/bloodbank/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setBloodBankData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blood bank data:", error);
        setError("Failed to load blood bank data");
      } finally {
        setLoading(false);
      }
    };

    const fetchBloodInventory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/bloodbank/inventory",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setBloodInventory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blood inventory:", error);
      }
    };

    fetchBloodBankData();
    fetchBloodInventory();
  }, []);

  if (loading) {
    return <div className="loading">Loading blood bank data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard bloodbank-dashboard">
      <div className="dashboard-header">
        <h1>Blood Bank Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/bloodbank/profile" className="btn primary">
            Update Profile
          </Link>
          <Link to="/bloodbank/donors" className="btn secondary">
            Manage Donors
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Blood Bank Information</h2>
          {bloodBankData && (
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{bloodBankData.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Address:</span>
                <span className="value">{bloodBankData.address}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{bloodBankData.phoneNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Operating Hours:</span>
                <span className="value">{bloodBankData.operatingHours}</span>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Blood Inventory</h2>
          <div className="inventory-grid">
            {bloodInventory.map((item) => (
              <div key={item.bloodType} className="inventory-card">
                <div className="blood-type">{item.bloodType}</div>
                <div className="quantity">
                  <span className="label">Available Units:</span>
                  <span className="value">{item.quantity}</span>
                </div>
                <div className="status">
                  <span className={`status ${item.status}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/bloodbank/requests" className="btn primary">
              Blood Requests
            </Link>
            <Link to="/bloodbank/donations" className="btn secondary">
              Donation History
            </Link>
            <Link to="/bloodbank/reports" className="btn secondary">
              Generate Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardBloodBank;
