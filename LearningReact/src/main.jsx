import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header.jsx";
import Index from "./Index.jsx"; 
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import Location from "./Location.jsx";
import Login from "./Login.jsx"; 
import Profile from "./Profile.jsx"; 
import "./index.css";
import "./Style.scss";

function Main() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/Index" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
