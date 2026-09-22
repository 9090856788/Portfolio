/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import SaaSLandingPage from "./pages/SaaSLandingPage.jsx";
import Home from "./pages/Home.jsx";
import Resume from "./pages/Resume.jsx";
import Project from "./pages/Project.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/Footer.jsx";

function AdminRedirect() {
  React.useEffect(() => {
    window.location.href = "/admin/";
  }, []);
  return (
    <Box sx={{ py: 12, textAlign: "center" }}>
      <h3>Opening Admin Workspace...</h3>
      <p style={{ marginTop: 8 }}>
        <a href="/admin/" style={{ color: "#4f46e5", textDecoration: "underline" }}>
          Click here if you are not redirected automatically
        </a>
      </p>
    </Box>
  );
}

function AuthRedirect({ mode = "login" }) {
  React.useEffect(() => {
    window.location.href = `/admin/?mode=${mode}`;
  }, [mode]);
  return (
    <Box sx={{ py: 12, textAlign: "center" }}>
      <h3>Redirecting to {mode === "register" ? "Registration" : "Sign In"}...</h3>
      <p style={{ marginTop: 8 }}>
        <a href={`/admin/?mode=${mode}`} style={{ color: "#6366f1", textDecoration: "underline" }}>
          Click here if you are not redirected automatically
        </a>
      </p>
    </Box>
  );
}

function MainLayout({ toggleDarkMode, darkMode }) {
  const location = useLocation();
  const isSaaSPage = location.pathname === "/";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ flex: "1" }}>
        <Routes>
          {/* SaaS Landing / Home Page */}
          <Route
            exact
            path="/"
            element={<SaaSLandingPage toggleDarkMode={toggleDarkMode} isDarkMode={darkMode} />}
          />

          {/* Client Portfolio Routes (base /portfolio) */}
          <Route
            exact
            path="/portfolio"
            element={<Home toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/resume"
            element={<Resume toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/experience"
            element={<Resume toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/project"
            element={<Project toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/works"
            element={<Project toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/contact"
            element={<Contact toggleDarkMode={toggleDarkMode} />}
          />

          {/* User-Specific Portfolio Routes (e.g. /portfolio/johndoe) */}
          <Route
            exact
            path="/portfolio/:username"
            element={<Home toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/:username/resume"
            element={<Resume toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/:username/experience"
            element={<Resume toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/:username/project"
            element={<Project toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/:username/works"
            element={<Project toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/portfolio/:username/contact"
            element={<Contact toggleDarkMode={toggleDarkMode} />}
          />

          {/* Direct legacy portfolio routes */}
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
            path="/works"
            element={<Project toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            exact
            path="/contact"
            element={<Contact toggleDarkMode={toggleDarkMode} />}
          />

          {/* User Auth Routes */}
          <Route path="/login" element={<AuthRedirect mode="login" />} />
          <Route path="/register" element={<AuthRedirect mode="register" />} />

          {/* Admin Dashboard */}
          <Route path="/admin*" element={<AdminRedirect />} />
        </Routes>
      </Box>
      {!isSaaSPage && <Footer />}
    </Box>
  );
}

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("portfolio_theme_mode");
    return saved ? saved === "dark" : false;
  });

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
