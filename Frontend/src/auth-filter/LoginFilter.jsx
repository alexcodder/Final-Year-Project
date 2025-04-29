import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../assets/image/Profile.png";

// Function to check if the user is logged in
function UserCheck() {
    const userId = localStorage.getItem("userId");
    return userId ? true : false; 
}

function LoginFilter() {
    const [loginStatus, setLoginStatus] = useState(UserCheck());
    const navigate = useNavigate(); 

    useEffect(() => {
        // Check login status immediately
        setLoginStatus(UserCheck());

        // Create an interval to check login status periodically
        const interval = setInterval(() => {
            setLoginStatus(UserCheck());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        setLoginStatus(false);
        navigate("/login");
    };

    if (loginStatus) {
        return (
            <div className="auth-buttons">
                <button className="auth-button notification">
                    <i className="far fa-bell"></i>
                </button>
                <Link to="/profile" className="auth-button profile">
                    <img src={Profile} alt="Profile" />
                </Link>
                <button onClick={handleLogout} className="auth-button logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        );
    }

    return (
        <div className="auth-buttons">
            <Link to="/login" className="auth-button login">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
            </Link>
            <Link to="/signup" className="auth-button signup">
                <i className="fas fa-user-plus"></i>
                <span>Sign Up</span>
            </Link>
        </div>
    );
}

export default LoginFilter;
