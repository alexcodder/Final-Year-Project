import React from "react";
import { FaAmbulance, FaHospital, FaTint } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <h2>HealthCare+</h2>
        <nav>
          <a href="#">🏠 Dashboard</a>
          <a href="#">🚑 Ambulances</a>
          <a href="#">🏥 Hospitals</a>
          <a href="#">🩸 Blood Banks</a>
          <a href="#">📜 Medical Profiles</a>
          <a href="#">⚙️ Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard__content">
        <section className="dashboard__stats">
          <StatCard icon={<FaAmbulance size={40} color="#2D9CDB" />} title="Active Ambulances" value="12" />
          <StatCard icon={<FaHospital size={40} color="#27AE60" />} title="Available Hospitals" value="25" />
          <StatCard icon={<FaTint size={40} color="#E63946" />} title="Blood Units Available" value="350" />
        </section>
      </main>
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

export default Dashboard;
