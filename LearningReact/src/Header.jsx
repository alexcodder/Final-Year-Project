import React from "react";
import { Link } from "react-router-dom";
import "./Style.scss";
import logo from "./assets/Logo.svg";
import Profile from "./assets/Profile.png";

const Login = false;
function LoginStatus() {
  if (Login == true) {
    function LogedIn() {
      return (
        <div className="Header__ProfileMenu">
          <Link to="/profile" className="Header__ProfileMenu-Profile">
            <img src={Profile} alt="Profile" />
          </Link>
        </div>
      );
    }
  } else if (Login == false) {
    function LoginStatus() {
      return (
        <div className="Header__ProfileMenu">
          <Link to="/login" className="Header__ProfileMenu-Login">
            Login
          </Link>
        </div>
      );
    }
  }
}

function Header() {
  return (
    <div className="Header">
      <Link to="/index">
        <div className="Header__Logo">
          <img src={logo} alt="Logo" />
          <h4>Hotel Shrestha</h4>
        </div>
      </Link>
      <div className="Header__Menu">
        <Link to="/index">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/location">Location</Link>
      </div>
      <div className="Header__ProfileMenu">
        <LoginStatus />
      </div>
    </div>
  );
}

export default Header;
