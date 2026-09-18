import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

/**
 * Public Footer component
 * Simple, clean copyright notice without administrative or API documentation links.
 */
const Footer = () => {
  const theme = useTheme();
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
        maxWidth: "1260px",
        margin: "24px auto 16px auto",
        padding: { xs: "12px 16px", sm: "16px 24px" },
        backgroundColor: isDarkMode ? "rgba(25, 28, 40, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        color: isDarkMode ? "#94a3b8" : "#64748b",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: softShadow,
        borderRadius: "16px",
        border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.88rem", fontWeight: 500 }}>
        © {new Date().getFullYear()} Kanhu Charan Sahoo. All rights reserved.
      </Typography>
    </Box>
  );
};

export default React.memo(Footer);
