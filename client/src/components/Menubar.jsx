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
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Menubar = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = theme.palette.mode === "dark";

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    { icon: <HomeIcon fontSize="small" />, label: "Home", path: "/" },
    { icon: <DescriptionIcon fontSize="small" />, label: "Resume", path: "/resume" },
    { icon: <WorkIcon fontSize="small" />, label: "Works", path: "/project" },
    { icon: <ContactMailIcon fontSize="small" />, label: "Contact", path: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 12px",
        borderRadius: "12px",
        bgcolor: theme.palette.background.default,
        boxShadow: isDarkMode
          ? `7px 7px 15px ${theme.palette.grey[900]}, -7px -7px 15px ${theme.palette.grey[800]}`
          : `7px 7px 15px ${theme.palette.grey[300]}, -7px -7px 15px ${theme.palette.grey[100]}`,
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      <IconButton
        sx={{
          display: { xs: "block", sm: "none" },
          color: isDarkMode ? "#fff" : "#000",
        }}
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </IconButton>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: { sm: 1.5, md: 2.5 },
          flexGrow: 1,
        }}
      >
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Box
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                cursor: "pointer",
                padding: "8px 14px",
                transition: "all 0.25s ease",
                backgroundColor: active
                  ? isDarkMode
                    ? "rgba(129, 140, 248, 0.18)"
                    : "rgba(99, 102, 241, 0.12)"
                  : "transparent",
                borderRadius: "10px",
                border: active
                  ? `1px solid ${isDarkMode ? "rgba(129, 140, 248, 0.35)" : "rgba(99, 102, 241, 0.25)"}`
                  : "1px solid transparent",
                color: active
                  ? isDarkMode
                    ? "#a5b4fc"
                    : "#4338ca"
                  : theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  borderRadius: "10px",
                },
              }}
            >
              {item.icon}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.92rem",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}

        {/* Link to Admin Panel */}
        <Tooltip title="Open Admin Control Panel">
          <Box
            component="a"
            href="/admin"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              textDecoration: "none",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: "10px",
              transition: "all 0.25s ease",
              color: isDarkMode ? "#f59e0b" : "#b45309",
              backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.1)",
              border: `1px solid ${isDarkMode ? "rgba(245, 158, 11, 0.25)" : "rgba(245, 158, 11, 0.2)"}`,
              "&:hover": {
                backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.18)",
              },
            }}
          >
            <AdminPanelSettingsIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.92rem" }}>
              Admin
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Dark Mode Toggle Button */}
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          width: 44,
          height: 44,
          bgcolor: theme.palette.background.default,
          boxShadow: isDarkMode
            ? `4px 4px 10px ${theme.palette.grey[900]}, -4px -4px 10px ${theme.palette.grey[800]}`
            : `4px 4px 10px ${theme.palette.grey[300]}, -4px -4px 10px ${theme.palette.grey[100]}`,
          borderRadius: "50%",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        {isDarkMode ? <Brightness7 fontSize="small" sx={{ color: "#fbbf24" }} /> : <Brightness4 fontSize="small" />}
      </IconButton>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: 250,
            bgcolor: theme.palette.background.default,
            height: "100%",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, px: 2 }}>
            Portfolio
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle();
                }}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  bgcolor: isActive(item.path)
                    ? isDarkMode
                      ? "rgba(129, 140, 248, 0.15)"
                      : "rgba(99, 102, 241, 0.1)"
                    : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? "bold" : "normal",
                  }}
                />
              </ListItem>
            ))}
            <ListItem
              button
              component="a"
              href="/admin"
              sx={{
                borderRadius: "8px",
                color: "#f59e0b",
                bgcolor: "rgba(245, 158, 11, 0.1)",
                mt: 2,
              }}
            >
              <ListItemIcon sx={{ color: "#f59e0b" }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Menubar;
