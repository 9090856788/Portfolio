/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Typography, Link, useTheme, useMediaQuery } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        padding: isMobile ? "12px" : "18px",
        backgroundColor: isDarkMode
          ? theme.palette.background.default
          : "#f5f5f5",
        color: isDarkMode ? theme.palette.text.primary : "text.secondary",
        textAlign: "center",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        boxShadow: isDarkMode
          ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
          : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        borderRadius: "16px",
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Kanhu Charan Sahoo. All rights reserved.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Link
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontSize: "0.85rem", color: theme.palette.primary.main }}
        >
          Swagger API Docs
        </Link>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>•</Typography>
        <Link
          href="/admin"
          underline="hover"
          sx={{ fontSize: "0.85rem", color: theme.palette.text.secondary, "&:hover": { color: theme.palette.primary.main } }}
        >
          Admin Portal
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
