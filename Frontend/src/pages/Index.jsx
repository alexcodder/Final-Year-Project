import React from "react";
import { useNavigate } from "react-router-dom";
import Banner2 from "../assets/image/Banner-2-Bg.jpg";
import Banner3 from "../assets/image/Banner-3-Bg.jpg";
import Banner4 from "../assets/image/Banner-4-Bg.jpg";
import Banner5 from "../assets/image/Banner-5-Bg.jpg";

function HomePage() {
  const navigate = useNavigate();
  
  const emergencyServices = [
    {
      icon: "fa-ambulance",
      title: "Real-time Ambulance Tracking",
      description: "Find and contact available ambulances instantly in Kathmandu. Track their location and get immediate assistance.",
      background: Banner2,
      route: "/Ambulance"
    },
    {
      icon: "fa-hospital",
      title: "Hospital Availability",
      description: "Locate nearby hospitals, check bed availability, and get real-time updates on medical services in your area.",
      background: Banner3,
      route: "/Hospital"
    },
    {
      icon: "fa-tint",
      title: "Blood Bank Network",
      description: "Connect with blood banks and donors. Request specific blood types and receive immediate notifications for urgent needs.",
      background: Banner4,
      route: "/BloodBank"
    },
    {
      icon: "fa-notes-medical",
      title: "Digital Health Records",
      description: "Store and access your medical history securely. Share critical health information with healthcare providers during emergencies.",
      background: Banner5,
      route: "/profile"
    }
  ];

  return (
    <div className="home-container">
      <EmergencyBanner navigate={navigate} />
      <ServicesSection services={emergencyServices} />
      <HowItWorks />
    </div>
  );
}

function EmergencyBanner({ navigate }) {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <h1>Emergency Healthcare Assistance in Kathmandu</h1>
        <p>Quick access to ambulances, hospitals, and blood banks - all in one place.</p>
        <div className="hero-buttons">
          <button className="cta-button primary" onClick={() => navigate('/Ambulance')}>
            <i className="fas fa-ambulance"></i> Find Ambulance
          </button>
          <button className="cta-button secondary" onClick={() => navigate('/Map')}>
            <i className="fas fa-hospital"></i> Locate Hospital
          </button>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }) {
  const navigate = useNavigate();

  return (
    <section className="services-section">
      {services.map((service, index) => (
        <div 
          key={index}
          className="service-banner" 
          style={{ 
            backgroundImage: `url(${service.background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => navigate(service.route)}
        >
          <div className="service-overlay">
            <div className="service-content">
              <i className={`fas ${service.icon} service-icon`}></i>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <button className="service-cta">Learn More</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "fa-location-dot",
      title: "Share Location",
      description: "Enable location services to find nearby emergency services instantly"
    },
    {
      icon: "fa-hand-pointer",
      title: "Select Service",
      description: "Choose the emergency service you need - ambulance, hospital, or blood bank"
    },
    {
      icon: "fa-link",
      title: "Get Connected",
      description: "We'll connect you with the nearest available verified help immediately"
    },
    {
      icon: "fa-truck-medical",
      title: "Receive Help",
      description: "Track your help in real-time and get the emergency assistance you need"
    }
  ];

  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step">
            <div className="step-icon">
              <i className={`fas ${step.icon}`}></i>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomePage;