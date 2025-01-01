/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import freelancerImage from "../img/freelancer.jpg";
import frontendImage from "../img/frontendImage.jpg";

const Home = ({ toggleDarkMode }) => {
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
          width: isMobile ? "100%" : isTablet ? "40%" : "35%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
          boxSizing: "border-box",
        }}
      >
        <ProfileCard />
      </Box>

      {/* Right Section: Menubar, InfoCards */}
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "60%" : "65%",
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
            backgroundColor: theme.palette.background.default,
            boxShadow:
              theme.palette.mode === "dark"
                ? `7px 7px 15px ${theme.palette.grey[900]}, 
                   -7px -7px 15px ${theme.palette.grey[800]}`
                : `7px 7px 15px ${theme.palette.grey[300]}, 
                   -7px -7px 15px ${theme.palette.grey[100]}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4" sx={{ marginRight: 2, marginBottom: 1 }}>
              About Me
            </Typography>
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
          </Box>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "2px",
              position: "relative",
              "&::before": {
                content: '"•"',
                position: "absolute",
                left: "-10px", // Adjust this value based on your needs
              },
            }}
          >
            As a Frontend developer passionate about creating seamless web
            experiences & developing robust and problem-solving skills and
            proven experience in creating and designing software in a
            test-driven environment.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              marginBottom: "2px",
              position: "relative",
              "&::before": {
                content: '"•"',
                position: "absolute",
                left: "-10px", // Adjust this value based on your needs
              },
            }}
          >
            My expertise spans front-end development, where I have good hands-on
            experience with HTML, CSS, JavaScript, Typescript, ReactJs, NextJs,
            Material UI, Tailwind CSS, ShadCn, for crafting sleek user
            interfaces.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              marginBottom: "2px",
              position: "relative",
              "&::before": {
                content: '"•"',
                position: "absolute",
                left: "-10px", // Adjust this value based on your needs
              },
            }}
          >
            On the server side, my focus revolves around the reliable
            functioning of applications using Node.js and Express.js.
          </Typography>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            What I do!
          </Typography>
          <Box>
            {/* Manually added InfoCards with different data */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile
                  ? "column"
                  : isTablet
                  ? "column"
                  : "row",
                justifyContent: "center",
                gap: 2,
                marginBottom: 2,
                marginTop: 2,
              }}
            >
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
    </Box>
  );
};

export default Home;
