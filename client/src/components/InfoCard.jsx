import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const InfoCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: isMobile ? "90%" : "auto",
        padding: isMobile ? "10px" : "20px",
        borderRadius: "16px",
        boxShadow:
          theme.palette.mode === "dark"
            ? `8px 8px 16px ${theme.palette.grey[900]}, 
             -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, 
             -8px -8px 16px ${theme.palette.grey[100]}`,
        marginTop: isMobile ? 1 : 2,
        backgroundColor: theme.palette.background.paper,
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
      <Typography
        variant="h6"
        sx={{
          fontSize: isMobile ? "1rem" : "1.25rem",
          fontWeight: "bold",
          marginBottom: 1,
        }}
      >
        Information Title
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: isMobile ? "0.875rem" : "1rem",
          color: theme.palette.text.secondary,
        }}
      >
        This is some informational content to be displayed within the InfoCard
        component. Adjust text as necessary to fit your needs.
      </Typography>
    </Box>
  );
};

export default InfoCard;
