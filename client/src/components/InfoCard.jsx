/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

/**
 * Reusable InfoCard component.
 * Features neumorphic styling, collapsible description, and smooth hover elevation.
 */
const InfoCard = ({ title, content, imageSrc }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle content expansion
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const truncatedContent =
    content.length > 115 ? content.substring(0, 115) + "..." : content;

  return (
    <Box
      sx={{
        width: "100%",
        padding: "18px",
        borderRadius: "14px",
        bgcolor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDarkMode
          ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
          : `6px 6px 14px ${theme.palette.grey[300]}, -6px -6px 14px ${theme.palette.grey[100]}`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDarkMode
            ? `10px 10px 20px ${theme.palette.grey[900]}, -10px -10px 20px ${theme.palette.grey[800]}`
            : `10px 10px 20px ${theme.palette.grey[300]}, -10px -10px 20px ${theme.palette.grey[100]}`,
        },
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {imageSrc && (
        <Box
          sx={{
            width: "100%",
            height: "150px",
            overflow: "hidden",
            borderRadius: "10px",
            mb: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <img
            src={imageSrc}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      )}

      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 700,
          fontSize: "1.05rem",
          letterSpacing: "-0.01em",
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.88rem",
          lineHeight: 1.65,
          mb: 2.5,
          flexGrow: 1,
        }}
      >
        {isExpanded ? content : truncatedContent}
      </Typography>

      <Box
        role="button"
        tabIndex={0}
        aria-label={isExpanded ? "Collapse description" : "Expand description"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleToggle();
          }
        }}
        onClick={handleToggle}
        sx={{
          alignSelf: "flex-end",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          boxShadow: isDarkMode
            ? `3px 3px 6px ${theme.palette.grey[900]}, -3px -3px 6px ${theme.palette.grey[800]}`
            : `3px 3px 6px ${theme.palette.grey[300]}, -3px -3px 6px ${theme.palette.grey[100]}`,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: isDarkMode ? "#a5b4fc" : "#4f46e5",
            lineHeight: 1,
          }}
        >
          {isExpanded ? "↑" : "→"}
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(InfoCard);
