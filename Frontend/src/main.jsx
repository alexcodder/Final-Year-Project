import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./auth-filter/PrivateRoute";

import ScrollToTop from "./component/ScrollToTop";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";

import Index from "./pages/Index.jsx";
import Hospital from "./pages/Hospital.jsx";
import BloodBank from "./pages/Blood.jsx";
import Ambulance from "./pages/Ambulance.jsx";
import Map from "./pages/Map.jsx";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/signUp.jsx";
import Profile from "./pages/Profile.jsx";
import PatientHistoryForm from "./pages/Form/Patient.jsx";
import AdminDashboard from "./pages/dashboard/adminDashboardPages/AdminDashboard.jsx";

import "./stylesheet/Style.scss";
import "./stylesheet/Signup.scss";
import "./stylesheet/LogIn.scss";
import "./stylesheet/LoginFilter.scss";
import "./stylesheet/Header.scss";
import "./stylesheet/Footer.scss";
import "./stylesheet/Home.scss";
import "./stylesheet/PatientForm.scss";

import React from "react";

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.toLowerCase() === '/admin-dashboard';

  return (
    <>
      {!isDashboard && <Header />}
      <div className="AppLayout">
        <div className="ContentWrapper">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/Hospital" element={<PrivateRoute element={<Hospital />} />} />
            <Route path="/BloodBank" element={<PrivateRoute element={<BloodBank />} />} />
            <Route path="/Ambulance" element={<PrivateRoute element={<Ambulance />} />} />
            <Route path="/Map" element={<PrivateRoute element={<Map />} />} />
            <Route path="/Profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
          </Routes>
        </div>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}

export function Main() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

// Find the root element
const container = document.getElementById("root");

// Ensure the container exists before creating the root
if (container) {
  // Create the root only once
  const root = ReactDOM.createRoot(container);
  // Render the app within StrictMode
  root.render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );
} else {
  console.error("Root container missing in HTML.");
}
