/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Typography, Link, useTheme, useMediaQuery } from "@mui/material";

/**
 * Public Footer component
 * Clean, lightweight footer displaying rights and Swagger API reference.
 */
const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const softShadow = isDarkMode
    ? "6px 6px 14px rgba(0, 0, 0, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.02)"
    : "6px 6px 14px rgba(0, 0, 0, 0.06), -4px -4px 10px rgba(255, 255, 255, 0.9)";

  return (
    <Box
      component="footer"
      id="portfolio-footer"
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "24px auto 16px auto",
        padding: isMobile ? "14px 18px" : "18px 24px",
        backgroundColor: isDarkMode ? "rgba(25, 28, 40, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        color: isDarkMode ? "#94a3b8" : "#64748b",
        textAlign: "center",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        boxShadow: softShadow,
        borderRadius: "16px",
        border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.88rem", fontWeight: 500 }}>
        © {new Date().getFullYear()} Kanhu Charan Sahoo. Built with React & Node.js.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Link
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: isDarkMode ? "#818cf8" : "#4f46e5",
            transition: "opacity 0.2s ease",
            "&:hover": { opacity: 0.85 },
          }}
        >
          Swagger API Documentation
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
