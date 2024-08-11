import React from "react";
import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material";

const Navbar = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: theme.palette.background.default,
        boxShadow:
          theme.palette.mode === "dark"
            ? `8px 8px 16px ${theme.palette.grey[900]}, 
             -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, 
             -8px -8px 16px ${theme.palette.grey[100]}`,
        padding: "0.5rem 1rem",
        borderRadius: "16px",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        margin: "0 auto", // Centering the Navbar
        maxWidth: "1200px", // Adjust to match the width of Menubar
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? `12px 12px 24px ${theme.palette.grey[900]}, 
               -12px -12px 24px ${theme.palette.grey[800]}`
              : `12px 12px 24px ${theme.palette.grey[300]}, 
               -12px -12px 24px ${theme.palette.grey[100]}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Kanhu
        </Typography>
        <IconButton
          onClick={toggleDarkMode}
          sx={{
            width: 60,
            height: 60,
            bgcolor: theme.palette.background.default,
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 16px ${theme.palette.grey[900]}, 
                 -8px -8px 16px ${theme.palette.grey[800]}`
                : `8px 8px 16px ${theme.palette.grey[300]}, 
                 -8px -8px 16px ${theme.palette.grey[100]}`,
            borderRadius: "50%",
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "dark"
                  ? `12px 12px 24px ${theme.palette.grey[900]}, 
                   -12px -12px 24px ${theme.palette.grey[800]}`
                  : `12px 12px 24px ${theme.palette.grey[300]}, 
                   -12px -12px 24px ${theme.palette.grey[100]}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
