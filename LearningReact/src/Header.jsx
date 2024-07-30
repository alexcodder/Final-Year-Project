import React from "react";
import { Link } from "react-router-dom";
import "./Style.scss";
import logo from "./assets/Logo.svg";

function Header() {
  return (
    <div className="Header no-hover">
      <Link to="/index">
        <div className="Header__Logo">
          <img src={logo} alt="Logo" />
          <label className="Name">
            <h4>Hotel Shrestha</h4>
          </label>
        </div>
      </Link>
      <div className="Header__Menu">
        <Link to="/index">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/location">Location</Link>
      </div>
      <div className="Header__ProfileMenu">
        {/* Profile and login links */}
        <Link to="/login" className="Header__Login">
          Login
        </Link>
        <Link to="/profile" className="Header__Profile">
          Profile
        </Link>
      </div>
    </div>
  );
}

export default Header;
