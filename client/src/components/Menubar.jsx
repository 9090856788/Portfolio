/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Brightness4, Brightness7 } from "@mui/icons-material";

/**
 * Public navigation bar.
 * Clean, neumorphic styling without admin navigation links.
 */
const Menubar = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Client-facing public menu items only (No Admin)
  const menuItems = [
    { icon: <HomeIcon fontSize="small" />, label: "Home", path: "/" },
    { icon: <DescriptionIcon fontSize="small" />, label: "Resume", path: "/resume" },
    { icon: <WorkIcon fontSize="small" />, label: "Works", path: "/project" },
    { icon: <ContactMailIcon fontSize="small" />, label: "Contact", path: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  // Modernized soft neuromorphic shadow
  const containerShadow = isDarkMode
    ? "6px 6px 14px rgba(0, 0, 0, 0.45), -4px -4px 12px rgba(255, 255, 255, 0.03)"
    : "6px 6px 14px rgba(0, 0, 0, 0.07), -4px -4px 12px rgba(255, 255, 255, 0.9)";

  return (
    <Box
      id="portfolio-menubar"
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: { xs: "6px 10px", sm: "8px 16px" },
        borderRadius: "14px",
        bgcolor: isDarkMode ? "rgba(30, 32, 44, 0.9)" : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"}`,
        boxShadow: containerShadow,
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      {/* Mobile Drawer Trigger */}
      <IconButton
        id="btn-mobile-menu"
        aria-label="Open Navigation Menu"
        sx={{
          display: { xs: "inline-flex", sm: "none" },
          color: isDarkMode ? "#f8fafc" : "#1e293b",
          p: 1,
        }}
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </IconButton>

      {/* Desktop Navigation Links */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: { sm: 1.5, md: 2 },
          flexGrow: 1,
        }}
      >
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Box
              key={item.label}
              id={`nav-${item.label.toLowerCase()}`}
              onClick={() => navigate(item.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                cursor: "pointer",
                padding: "8px 16px",
                transition: "all 0.2s ease-in-out",
                backgroundColor: active
                  ? isDarkMode
                    ? "rgba(129, 140, 248, 0.16)"
                    : "rgba(99, 102, 241, 0.1)"
                  : "transparent",
                borderRadius: "10px",
                border: active
                  ? `1px solid ${isDarkMode ? "rgba(129, 140, 248, 0.3)" : "rgba(99, 102, 241, 0.25)"}`
                  : "1px solid transparent",
                color: active
                  ? isDarkMode
                    ? "#a5b4fc"
                    : "#4338ca"
                  : isDarkMode
                  ? "#cbd5e1"
                  : "#475569",
                "&:hover": {
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                },
              }}
            >
              {item.icon}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.93rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Dark / Light Theme Toggle */}
      <IconButton
        id="btn-theme-toggle"
        aria-label="Toggle Color Theme"
        onClick={toggleDarkMode}
        sx={{
          width: 40,
          height: 40,
          bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
          border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
          color: isDarkMode ? "#fbbf24" : "#475569",
          borderRadius: "50%",
          transition: "transform 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            transform: "scale(1.06)",
            bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {isDarkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 270,
            bgcolor: isDarkMode ? "#131622" : "#ffffff",
            color: isDarkMode ? "#f8fafc" : "#0f172a",
            p: 2.5,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Portfolio
          </Typography>
          <IconButton size="small" onClick={handleDrawerToggle} sx={{ color: "inherit" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem
                button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle();
                }}
                sx={{
                  borderRadius: "10px",
                  p: 1.2,
                  bgcolor: active
                    ? isDarkMode
                      ? "rgba(129, 140, 248, 0.15)"
                      : "rgba(99, 102, 241, 0.1)"
                    : "transparent",
                  color: active
                    ? isDarkMode
                      ? "#a5b4fc"
                      : "#4338ca"
                    : "inherit",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
};

export default Menubar;
