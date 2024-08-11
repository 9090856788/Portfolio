import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        padding: isMobile ? "10px" : "20px",
        backgroundColor: isDarkMode
          ? theme.palette.background.default
          : "#f5f5f5",
        color: isDarkMode ? theme.palette.text.primary : "text.secondary",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        boxShadow: isDarkMode
          ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
          : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        borderRadius: "16px",
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      <Typography variant="body2">
        © 2024 Kanhu Charan Sahoo. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
