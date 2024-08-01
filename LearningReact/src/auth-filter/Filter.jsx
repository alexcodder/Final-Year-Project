import { user } from "../component/ConstantVariable";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Profile from "../assets/image/Profile.png";

function UserCheck() {
    let loginStatus;
    if (user === 1) {
        loginStatus = true;
    } else {
        loginStatus = false;
    }
    return loginStatus;
}

function LoginFilter() {
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        setLoginStatus(UserCheck()); // Set the initial loginStatus based on UserCheck
    }, []);

    function Loginfilter() {
        if (loginStatus) {
            return (
                <div className="Header__ProfileMenu">
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
                    <span className="Header__ProfileMenu-Seperator">/</span>
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