import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
// import Footer from "./component/Footer.jsx";
import Index from "./pages/Index.jsx"; 
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Location from "./pages/Location.jsx";
import Login from "./pages/Login.jsx"; 
import SignUp from "./pages/signIn.jsx";
import Profile from "./pages/Profile.jsx"; 
import "./component/ConstantVariable.jsx";
import "./stylesheet/index.css";
import "./stylesheet/Style.scss";


function Main() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
