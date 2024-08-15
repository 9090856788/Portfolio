import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import ContactForm from "../components/ContactForm";

const Resume = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: isMobile ? "10px" : "20px",
        margin: "0 auto",
        maxWidth: "1200px",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Left Section: ProfileCard */}
      <Box
        sx={{
          width: isMobile ? "100%" : "35%",
          padding: isMobile ? "10px" : "20px",
          boxSizing: "border-box",
        }}
      >
        <ProfileCard />
      </Box>

      {/* Right Section: Menubar, InfoCards */}
      <Box
        sx={{
          width: isMobile ? "100%" : "65%",
          padding: isMobile ? "10px" : "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Menubar toggleDarkMode={toggleDarkMode} />
        <Box
          sx={{
            marginTop: "20px",
            padding: "20px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px",
            backgroundColor: theme.palette.background.default,
            boxShadow:
              theme.palette.mode === "dark"
                ? `7px 7px 15px ${theme.palette.grey[900]}, 
                   -7px -7px 15px ${theme.palette.grey[800]}`
                : `7px 7px 15px ${theme.palette.grey[300]}, 
                   -7px -7px 15px ${theme.palette.grey[100]}`,
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Contact Me
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <ContactForm />
            {/* Manually added InfoCards with different data */}

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Resume;
