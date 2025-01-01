/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import Home from "./pages/Home.jsx";
import Resume from "./pages/Resume.jsx";
import Project from "./pages/Project.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<Home toggleDarkMode={toggleDarkMode} />}
          />
          <Route exact path="/resume" element={<Resume toggleDarkMode={toggleDarkMode} />} />
          <Route exact path="/project" element={<Project toggleDarkMode={toggleDarkMode} />} />
          <Route exact path="/contact" element={<Contact toggleDarkMode={toggleDarkMode} />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
