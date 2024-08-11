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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Menubar = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === "dark";

  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <DescriptionIcon />, label: "Resume", path: "/resume" },
    { icon: <WorkIcon />, label: "Work", path: "/project" },
    { icon: <ContactMailIcon />, label: "Contact", path: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: {
          xs: "space-between",
          sm: "space-between",
          md: "space-between",
          lg: "space-between",
          xl: "space-between",
        },
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
      {/* Name on the left */}
      {/* <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" }, marginLeft: 1 }}>
        Kanhu
      </Typography> */}
      {/* <svg>
        <text x="50%" y="50%" dy=".35em" text-anchor="middle">
          Kanhu
        </text>
      </svg> */}

      {/* Hamburger Icon for Mobile */}
      <IconButton
        sx={{ display: { xs: "block", sm: "none" } }}
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </IconButton>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: 2,
          flexGrow: 1,
        }}
      >
        {menuItems.map((item) => (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              padding: 1,
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
              },
            }}
          >
            {item.icon}
            <Typography variant="body1" sx={{ fontSize: "1rem" }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Dark Mode Toggle Button */}
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          display: { xs: "block", sm: "flex" },
          width: 60,
          height: 60,
          bgcolor: theme.palette.background.default,
          boxShadow:
            theme.palette.mode === "dark"
              ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
              : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
          borderRadius: "50%",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            boxShadow:
              theme.palette.mode === "dark"
                ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
            transform: "translateY(-2px)",
          },
        }}
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Drawer Component for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: theme.palette.background.default,
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle(); // Close drawer after selection
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                width: 60,
                height: 60,
                bgcolor: theme.palette.background.default,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
                    : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
                borderRadius: "50%",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                      : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
                  transform: "translateY(-2px)",
                },
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
