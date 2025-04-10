import React from "react";
import { useNavigate } from "react-router-dom";
import Banner1 from "../assets/image/Banner-1-Bg.jpg";
import Banner2 from "../assets/image/Banner-2-Bg.jpg";
import Banner3 from "../assets/image/Banner-3-Bg.jpg";
import Banner4 from "../assets/image/Banner-4-Bg.jpg";


function HomePage() {
  const heroBanner = [
    { 
      icon: "fa-hand-holding-medical", 
      title: "Emergency Services", 
      description: "Get immediate medical attention during emergencies.",
      background: Banner1,
      route: "/Map"
    },
    { 
      icon: "fa-ambulance", 
      title: "Ambulance Services", 
      description: "Find and book the nearest available ambulance instantly.",
      background: Banner2,
      route: "/Ambulance"
    },
    { 
      icon: "fa-hospital", 
      title: "Hospital Services", 
      description: "Check hospital availability, bed counts, and doctor schedules.",
      background: Banner3,
      route: "/Hospital"
    },
    { 
      icon: "fa-hand-holding-medical", 
      title: "Blood Bank Services", 
      description: "Request or donate blood and locate nearby blood banks easily.",
      background: Banner4,
      route: "/BloodBank"
    }
  ];

  return (
    <div className="home-container">
      <HeroBanner services={heroBanner} />
    </div>
  );
}

function HeroBanner({ services }) {
  const navigate = useNavigate();

  return (
    <section className="services-section">
      {services.map((service, index) => (
        <ServiceBanner key={index} icon={service.icon} title={service.title} description={service.description} background={service.background} onClick={() => navigate(service.route)}/>
      ))}
    </section>
  );
}

function ServiceBanner({ icon, title, description, background, onClick }) {
  return (
    <div 
      className="service-banner" 
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onClick={onClick}
    >
      <div className="service-overlay">
        <div className="service-content">
          <i className={`fas ${icon} service-icon`}></i>
          <h2>{title}</h2>
          <p>{description}</p>
          <button className="service-cta">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
