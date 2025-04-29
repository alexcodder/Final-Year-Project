import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DashboardHospital() {
  const [hospitalData, setHospitalData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/hospital/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setHospitalData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hospital data:", error);
        setError("Failed to load hospital data");
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/appointments/hospital",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchHospitalData();
    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="loading">Loading hospital data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard hospital-dashboard">
      <div className="dashboard-header">
        <h1>Hospital Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/hospital/profile" className="btn primary">
            Update Profile
          </Link>
          <Link to="/hospital/doctors" className="btn secondary">
            Manage Doctors
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Hospital Information</h2>
          {hospitalData && (
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{hospitalData.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Address:</span>
                <span className="value">{hospitalData.address}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{hospitalData.phoneNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Specialties:</span>
                <span className="value">
                  {hospitalData.specialties?.join(", ")}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Today's Appointments</h2>
          <div className="appointments-list">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-info">
                    <span className="patient-name">
                      {appointment.patientName}
                    </span>
                    <span className="doctor-name">
                      Dr. {appointment.doctorName}
                    </span>
                    <span className="time">
                      {new Date(appointment.dateTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="appointment-status">
                    <span className={`status ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No appointments scheduled for today</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/hospital/emergency" className="btn emergency">
              Emergency Cases
            </Link>
            <Link to="/hospital/patients" className="btn primary">
              View All Patients
            </Link>
            <Link to="/hospital/reports" className="btn secondary">
              Generate Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHospital;
