// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "../stylesheet/Style.scss";
// import logo from "../assets/image/Logo.png";
// import Profile from "../assets/image/Profile.png";
// import { LoginStatus } from "./ConstantVariable";
// console.log({LoginStatus})

// function Loginfilter() {
//     if (LoginStatus === true) {
//         return (
//             <div className="Header__ProfileMenu">
//                 <Link to="/profile" className="Header__ProfileMenu-Profile">
//                     <img src={Profile} alt="Profile" />
//                 </Link>
//             </div>
//         );
//     } else {
//         return (
//             <div className="Header__ProfileMenu">
//                 <Link to="/login" className="Header__ProfileMenu-Login" >
//                     Login
//                 </Link>
//                 <span className="Header__ProfileMenu-Seperator">/</span>
//                 <Link to="/SignUp" className="Header__ProfileMenu-Signup">
//                     Signup
//                 </Link>
//             </div>
//         );
//     }
// }

// function Header() {
//     return (
//         <div className="Header">
//             <Link to="/index">
//                 <div className="Header__Logo">
//                     <img src={logo} alt="Logo" />
//                     <h4>Hotel Shrestha</h4>
//                 </div>
//             </Link>
//             <div className="Header__Menu">
//                 <Link to="/index">Home</Link>
//                 <Link to="/about">About</Link>
//                 <Link to="/contact">Contact</Link>
//                 <Link to="/location">Location</Link>
//             </div>
//             <div className="Header__ProfileMenu">
//                 <Loginfilter />
//             </div>
//         </div>
//     );
// }

// export default Header;
