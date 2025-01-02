/* eslint-disable react/prop-types */
import React from "react";
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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Menubar = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const isDarkMode = theme.palette.mode === "dark";

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <DescriptionIcon />, label: "Resume", path: "/resume" },
    { icon: <WorkIcon />, label: "Works", path: "/project" },
    { icon: <ContactMailIcon />, label: "Contact", path: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = (path) => location.pathname === path; // Check if menu item is active

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px",
        borderRadius: "10px",
        bgcolor: theme.palette.background.default,
        boxShadow: isDarkMode
          ? `7px 7px 15px ${theme.palette.grey[900]}, -7px -7px 15px ${theme.palette.grey[800]}`
          : `7px 7px 15px ${theme.palette.grey[300]}, -7px -7px 15px ${theme.palette.grey[100]}`,
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: isDarkMode
            ? `inset 7px 7px 15px ${theme.palette.grey[900]}, inset -7px -7px 15px ${theme.palette.grey[800]}`
            : `inset 7px 7px 15px ${theme.palette.grey[300]}, inset -7px -7px 15px ${theme.palette.grey[100]}`,
        },
      }}
    >
      <IconButton
        sx={{
          display: { xs: "block", sm: "none" },
          color: isDarkMode ? "#fff" : "#000",
        }}
        onClick={handleDrawerToggle}
      >
        <MenuIcon sx={{ marginTop: 1 }} />
      </IconButton>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex", md: "flex" },
          alignItems: "center",
          gap: { xs: 1, sm: 2, md: 3 },
          flexGrow: 1,
          marginLeft: 1,
        }}
      >
        {menuItems.map((item) => (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { sm: "center" },
              flexDirection: { xs: "row", sm: "column" },
              gap: { xs: 1, sm: 0 },
              cursor: "pointer",
              padding: 1,
              transition: "background-color 0.3s",
              backgroundColor: isActive(item.path)
                ? isDarkMode
                  ? "#444"
                  : "#e0e0e0"
                : "transparent", // Active color change
              borderRadius: isActive(item.path) ? "16px" : "0px", // Optional rounded corners for active item
              "&:hover": {
                backgroundColor: isActive(item.path)
                  ? isDarkMode
                    ? "#555"
                    : "#f0f0f0"
                  : isDarkMode
                  ? "#333"
                  : "#f0f0f0",
                borderRadius: "16px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: { sm: 0.5 },
              }}
            >
              {item.icon}
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "0.85rem", md: "1rem" },
                textAlign: { sm: "center" },
                fontWeight: isActive(item.path) ? "bold" : "normal", // Optional font weight change for active item
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Dark Mode Toggle Button */}
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          width: 60,
          height: 60,
          marginRight: 1,
          bgcolor: theme.palette.background.default,
          boxShadow: isDarkMode
            ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
          borderRadius: "50%",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: isDarkMode
              ? `inset 8px 8px 16px ${theme.palette.grey[900]}, inset -8px -8px 16px ${theme.palette.grey[800]}`
              : `inset 8px 8px 16px ${theme.palette.grey[300]}, inset -8px -8px 16px ${theme.palette.grey[100]}`,
          },
        }}
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: 250,
            bgcolor: theme.palette.background.default,
            height: "100%",
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle();
                }}
                sx={{
                  backgroundColor: isActive(item.path)
                    ? isDarkMode
                      ? "#444"
                      : "#e0e0e0"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive(item.path)
                      ? isDarkMode
                        ? "#555"
                        : "#f0f0f0"
                      : isDarkMode
                      ? "#333"
                      : "#f0f0f0",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: 1,
            }}
          >
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                bgcolor: theme.palette.background.default,
                boxShadow: isDarkMode
                  ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                  : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
                transform: "translateY(-2px)",
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Menubar;
