// Header.jsx
import { Link } from "react-router-dom";
import logo from "../assets/image/Logo.png";
import LoginFilter from "../auth-filter/LoginFilter"; // Your custom login filter component

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/home" className="header-logo">
          <img src={logo} alt="EHA Logo" />
          <span>Emergency Healthcare Assistance</span>
        </Link>

        <nav className="header-nav">
          <Link to="/home">Home</Link>
          <Link to="/Hospital">Hospital</Link>
          <Link to="/BloodBank">Blood Bank</Link>
          <Link to="/Ambulance">Ambulance</Link>
          <Link to="/Map">Map</Link>
        </nav>

        <div className="header-auth">
          <LoginFilter />
        </div>
      </div>
    </header>
  );
};

export default Header;
