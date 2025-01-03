/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import ResumeForm from "../components/ResumeForm";
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
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 16px ${theme.palette.grey[900]}, 
                 -8px -8px 16px ${theme.palette.grey[800]}`
                : `8px 8px 16px ${theme.palette.grey[300]}, 
                 -8px -8px 16px ${theme.palette.grey[100]}`,
            // marginTop: isMobile ? 6 : isTablet ? 8 : 12,
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4" sx={{ marginRight: 2, marginBottom: 1 }}>
              Resume
            </Typography>
            {isMobile ? (
              ""
            ) : (
              <Box
                component="hr"
                sx={{
                  flexGrow: 1,
                  border: 0,
                  borderTop: "2px solid",
                  borderColor: "currentColor",
                  margin: 0,
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <ResumeForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Resume;
