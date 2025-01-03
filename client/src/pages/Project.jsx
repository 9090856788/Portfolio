/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import freelancerImage from "../img/freelancer.jpg";
import frontendImage from "../img/frontendImage.jpg";
import InfoCard from "../components/InfoCard";

const Project = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : isTablet ? "row" : "row",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
        margin: "0 auto",
        maxWidth: "1200px",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Left Section: ProfileCard */}
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "45%" : "35%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
          boxSizing: "border-box",
        }}
      >
        <ProfileCard />
      </Box>

      {/* Right Section: Menubar, InfoCards */}
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "55%" : "65%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
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
              Portfolio
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

          {/* Manually added InfoCards with different data */}

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : isTablet ? "column" : "row",
              justifyContent: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <InfoCard
              title="Frontend Development"
              content="As a Frontend Developer, I am captivated by creating dynamic and scalable web applications using my expertise in React.js and Next.js. I am always eager to dive into new projects that leverage these technologies, along with UI frameworks like MUI and Tailwind CSS, to build fast, user-friendly applications."
              imageSrc={frontendImage} // Pass image source here
            />
            <InfoCard
              title="Frontend Development"
              content="As a Frontend Developer, I am captivated by creating dynamic and scalable web applications using my expertise in React.js and Next.js. I am always eager to dive into new projects that leverage these technologies, along with UI frameworks like MUI and Tailwind CSS, to build fast, user-friendly applications."
              imageSrc={frontendImage} // Pass image source here
            />
            <InfoCard
              title="Freelancer"
              content="I specialize in building high-performance web applications with React.js and Next.js. Using modern UI frameworks like MUI and Tailwind CSS, I create scalable, responsive designs tailored to your needs. I combine advanced technology with innovative design to deliver user-centric solutions that are both visually appealing and seamless in performance. Whether you need a new application or enhancements to an existing one, I’m here to turn your vision into reality with precision and creativity."
              imageSrc={freelancerImage} // Pass image source here
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : isTablet ? "column" : "row",
              justifyContent: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <InfoCard
              title="Frontend Development"
              content="As a Frontend Developer, I am captivated by creating dynamic and scalable web applications using my expertise in React.js and Next.js. I am always eager to dive into new projects that leverage these technologies, along with UI frameworks like MUI and Tailwind CSS, to build fast, user-friendly applications."
              imageSrc={frontendImage} // Pass image source here
            />
            <InfoCard
              title="Frontend Development"
              content="As a Frontend Developer, I am captivated by creating dynamic and scalable web applications using my expertise in React.js and Next.js. I am always eager to dive into new projects that leverage these technologies, along with UI frameworks like MUI and Tailwind CSS, to build fast, user-friendly applications."
              imageSrc={frontendImage} // Pass image source here
            />
            <InfoCard
              title="Freelancer"
              content="I specialize in building high-performance web applications with React.js and Next.js. Using modern UI frameworks like MUI and Tailwind CSS, I create scalable, responsive designs tailored to your needs. I combine advanced technology with innovative design to deliver user-centric solutions that are both visually appealing and seamless in performance. Whether you need a new application or enhancements to an existing one, I’m here to turn your vision into reality with precision and creativity."
              imageSrc={freelancerImage} // Pass image source here
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Project;
