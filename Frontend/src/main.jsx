import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PrivateRoute from "./auth-filter/PrivateRoute";

import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Index from "./pages/Index.jsx";
import Hospital from "./pages/Hospital.jsx";
import Ambulance from "./pages/Ambulance.jsx";
import Map from "./pages/Map.jsx";
import BloodBank from "./pages/BloodBank.jsx"

// Import Dashboard Pages
import Login from "./pages/Login.jsx";
import SignUp from "./pages/signUp.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/dashboard/adminDashboardPages/AdminDashboard.jsx";
import DashboardAmbulance from "./pages/dashboard/DashboardAmbulance.jsx";
import DashboardHospital from './pages/dashboard/DashboardHospital.jsx';
import DashboardBloodBank from './pages/dashboard/DashboardBloodBank.jsx';

// Import Form Components
import PatientHistoryForm from "./components/Forms/Patient.jsx";
import UpdatePatientHistory from "./components/Forms/UpdateProfile.jsx";
import EditProfileForm from "./components/Forms/EditProfileForm.jsx";
import AddHospital from "./components/Forms/AddHospital.jsx";
import AddBloodBank from "./components/Forms/AddBloodBankForm.jsx";
import RequestBlood from "./components/Forms/BloodRequestForm.jsx"

// Import Profile Components
import PatientProfile from "./pages/Profile.jsx";

// Import all stylesheets
import "./stylesheets/Style.scss";
import "./stylesheets/Signup.scss";
import "./stylesheets/LogIn.scss";
import "./stylesheets/LoginFilter.scss";
import "./stylesheets/Header.scss";
import "./stylesheets/Footer.scss";
import "./stylesheets/Home.scss";
import "./stylesheets/PatientForm.scss";
import "./stylesheets/Profile.scss";
import "./stylesheets/UpdateProfile.scss";
import "./stylesheets/EditProfileForm.scss";
import "./stylesheets/AddHospital.scss";
import "./stylesheets/Map.scss";
import "./stylesheets/HospitalDashboard.scss";
import "./stylesheets/bloodbank.scss";

import React from "react";

// Export commonly used components and hooks
export { useState, useEffect, axios, Link };

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase().includes('admin');
  const isDashboard = location.pathname.toLowerCase().includes('dashboard');
  const isPatientPage = location.pathname.toLowerCase().includes('patient');

  // Show header/footer on all pages except admin pages and non-patient dashboards
  const showHeaderFooter = !isAdminPage && (!isDashboard || isPatientPage);

  return (
    <>
      {showHeaderFooter && <Header />}
      <div className="AppLayout">
        <div className="ContentWrapper">
          <Routes>  
            {/* Home Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />

            {/* Login and Signup Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/Hospital" element={<PrivateRoute element={<Hospital />} />} />
            <Route path="/Ambulance" element={<PrivateRoute element={<Ambulance />} />} />
            <Route path="/Map" element={<PrivateRoute element={<Map />} />} />
            <Route path="/BloodBank" element={<PrivateRoute element={<BloodBank />} />} />
            <Route path="/Profile" element={<PrivateRoute element={<Profile />} />} />
            
            {/* Dashboard Routes */}
            <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
            <Route path="/ambulance-dashboard" element={<PrivateRoute element={<DashboardAmbulance />} />} />
            <Route path="/hospital-dashboard" element={<PrivateRoute element={<DashboardHospital />} />} />
            <Route path="/bloodbank-dashboard" element={<PrivateRoute element={<DashboardBloodBank />} />} />

            {/* Profile Routes */}
            <Route path="/patient/profile" element={<PrivateRoute element={<PatientProfile />} />} />

            {/* Create Form Routes */}
            <Route path="/PatientHistoryForm" element={<PatientHistoryForm />} />
            <Route path="/Add-hospital" element={<PrivateRoute element={<AddHospital />} />} /> 
            <Route path="/BloodRequest" element={<RequestBlood />} />
            <Route path="/Add-bloodbank" element={<PrivateRoute element={<AddBloodBank />} />} /> 

            {/* Edit Form Routes */}
            <Route path="/patient-history/edit" element={<PrivateRoute element={<UpdatePatientHistory />} />} />
            <Route path="/patient/profile/edit" element={<PrivateRoute element={<EditProfileForm />} />} />
          </Routes>
        </div>
      </div>
      {showHeaderFooter && <Footer />}
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
