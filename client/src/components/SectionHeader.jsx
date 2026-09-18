/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

/**
 * Reusable Section Header component.
 * Provides unified font styling, optical hierarchy, and sleek responsive divider line
 * consistently across all portfolio views (Home, Resume, Projects, Contact).
 */
const SectionHeader = ({ title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.55rem", sm: "1.9rem", md: "2.15rem" },
            letterSpacing: "-0.025em",
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        {/* Sleek divider line matching neumorphic ambient lighting */}
        {!isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              height: "2px",
              borderRadius: "2px",
              background: isDarkMode
                ? "linear-gradient(90deg, rgba(129, 140, 248, 0.45) 0%, rgba(255, 255, 255, 0.08) 70%, transparent 100%)"
                : "linear-gradient(90deg, rgba(79, 70, 229, 0.35) 0%, rgba(0, 0, 0, 0.08) 70%, transparent 100%)",
            }}
          />
        )}
      </Box>

      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: theme.palette.text.secondary,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(SectionHeader);
