import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth-filter/PrivateRoute";

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

import Admin from "./pages/Admin.jsx";
// import AmbulanceDashboard from "./pages/dashboard/DashboardAmbulance";
// import HospitalDashboard from "./pages/dashboard/DashboardHospital";
// import BloodBankDashboard from "./pages/dashboard/DashboardBloodBank";

import "./stylesheet/Home.scss";
import "./stylesheet/Style.scss";
import "./stylesheet/Header.scss";
import "./stylesheet/Footer.scss";
import "./stylesheet/Style.scss";
import "./stylesheet/LogIn.scss";
import "./stylesheet/PatientForm.scss";

export function Main() {
  return (
    <Router>
      <Header />
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

            <Route path="/Admin" element={<PrivateRoute element={<Admin />} isAdminRequired={true} />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
