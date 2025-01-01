/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

const InfoCard = ({ title, content, imageSrc }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle content visibility
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate content if not expanded
  const truncatedContent =
    content.length > 100 ? content.substring(0, 100) + "..." : content;

  return (
    <Box
      sx={{
        width: "300px",
        padding: "16px",
        borderRadius: "12px",
        bgcolor: theme.palette.background.default,
        boxShadow: isDarkMode
          ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
          : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: isDarkMode
            ? `inset 8px 8px 16px ${theme.palette.grey[900]}, inset -8px -8px 16px ${theme.palette.grey[800]}`
            : `inset 8px 8px 16px ${theme.palette.grey[300]}, inset -8px -8px 16px ${theme.palette.grey[100]}`,
        },
        position: "relative",
        overflow: 'hidden', // Ensure that the image does not overflow the card
      }}
    >
      {imageSrc && (
        <Box
          sx={{
            width: "100%",
            height: "150px",
            overflow: "hidden",
            borderRadius: "8px",
            mb: "16px",
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
        component="p"
        sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}
      >
        {title}
      </Typography>
      <Typography variant="body2" component="p" sx={{ marginBottom: "16px" }}>
        {isExpanded ? content : truncatedContent}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          bottom: "8px",
          right: "8px",
          backgroundColor: isDarkMode
            ? theme.palette.grey[800]
            : theme.palette.grey[200],
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          boxShadow: isDarkMode
            ? `4px 4px 8px ${theme.palette.grey[900]}, -4px -4px 8px ${theme.palette.grey[800]}`
            : `4px 4px 8px ${theme.palette.grey[300]}, -4px -4px 8px ${theme.palette.grey[100]}`,
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" }}
        >
          {isExpanded ? "↑" : "→"}
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoCard;
