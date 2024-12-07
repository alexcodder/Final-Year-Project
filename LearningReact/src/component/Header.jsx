import { Link } from "react-router-dom";
import "../stylesheet/Header.scss";
import logo from "../assets/image/Logo.png";
import LoginFilter from "../auth-filter/Filter";

const Header = () => {
  return (
    <div className="Header">
      <Link to="/home">
        <div className="Header__Logo">
          <img src={logo} alt="Logo" />
          <h4>Hotel Shrestha</h4>
        </div>
      </Link>
      <div className="Header__Menu">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/location">Location</Link>
      </div>
      <div className="Header__ProfileMenu">
        < LoginFilter />
      </div>
    </div>
  );
};

export default Header;