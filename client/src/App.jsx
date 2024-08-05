import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Resume from "./pages/Resume.jsx";
import Project from "./pages/Project.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/resume" element={<Resume />} />
          <Route exact path="/project" element={<Project />} />
          <Route exact path="/contact" element={<Contact />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
};

export default App;
