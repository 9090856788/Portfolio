/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import Home from "./pages/Home.jsx";
import Resume from "./pages/Resume.jsx";
import Project from "./pages/Project.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("portfolio_theme_mode");
    return saved ? saved === "dark" : false;
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#818cf8" : "#4f46e5",
      },
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.015em",
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const next = !prevMode;
      localStorage.setItem("portfolio_theme_mode", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Router>
          <Box sx={{ flex: "1" }}>
            <Routes>
              <Route
                exact
                path="/"
                element={<Home toggleDarkMode={toggleDarkMode} />}
              />
              <Route
                exact
                path="/resume"
                element={<Resume toggleDarkMode={toggleDarkMode} />}
              />
              <Route
                exact
                path="/project"
                element={<Project toggleDarkMode={toggleDarkMode} />}
              />
              <Route
                exact
                path="/contact"
                element={<Contact toggleDarkMode={toggleDarkMode} />}
              />
            </Routes>
          </Box>
          <Footer />
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;
