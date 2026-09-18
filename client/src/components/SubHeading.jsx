/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

/**
 * Reusable SubHeading component.
 * Provides consistent typography, spacing, and visual accent indicator
 * across all pages for subsection titles (e.g., 'What I do!', 'Education', 'Skills').
 */
const SubHeading = ({ title, icon, sx = {} }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        mt: 3.5,
        mb: 2,
        ...sx,
      }}
    >
      {/* Accent marker for crisp section demarcation */}
      <Box
        sx={{
          width: "4px",
          height: "20px",
          borderRadius: "4px",
          backgroundColor: isDarkMode ? "#818cf8" : "#4f46e5",
          boxShadow: isDarkMode
            ? "0 0 8px rgba(129, 140, 248, 0.6)"
            : "0 0 8px rgba(79, 70, 229, 0.4)",
        }}
      />

      {icon && (
        <Box sx={{ display: "flex", alignItems: "center", color: "primary.main" }}>
          {icon}
        </Box>
      )}

      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.2rem", sm: "1.35rem" },
          letterSpacing: "-0.015em",
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default React.memo(SubHeading);
