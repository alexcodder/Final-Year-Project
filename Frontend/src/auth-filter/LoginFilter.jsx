import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../assets/image/Profile.png";

// Function to check if the user is logged in
function UserCheck() {
    const userId = localStorage.getItem("userId");
    return userId ? true : false; 
}

function LoginFilter() {
    const [loginStatus, setLoginStatus] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const handleStorageChange = () => {
            setLoginStatus(UserCheck());
        };

        setLoginStatus(UserCheck());

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    function handleLogout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        setLoginStatus(false);
        navigate("/login"); 
    }

    function Loginfilter() {
        if (loginStatus) {
            return (
                <div className="Header__ProfileMenu">
                    <i className="far fa-bell fa-2x Notification" onClick={Notification}></i>
                    <Link to="/profile" className="Header__ProfileMenu-Profile">
                        <img src={Profile} alt="Profile" />
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="Header__ProfileMenu">
                    <Link to="/login" className="Header__ProfileMenu-Login">
                        Login
                    </Link>
                    <Link to="/SignUp" className="Header__ProfileMenu-Signup">
                        Signup
                    </Link>
                </div>
            );
        }
    }

    return Loginfilter();
}

export default LoginFilter;
