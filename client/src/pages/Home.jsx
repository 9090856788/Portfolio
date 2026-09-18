/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, useTheme, useMediaQuery, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import { fetchUserProfile } from "../api/portfolioApi";
import freelancerImage from "../img/freelancer.jpg";
import frontendImage from "../img/frontendImage.jpg";

const Home = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { data: user, isLoading } = useQuery({
    queryKey: ["portfolioUser"],
    queryFn: fetchUserProfile,
  });

  // Split bio text into paragraphs/bullets
  const aboutBullets = user?.aboutMe
    ? user.aboutMe.split("\n\n").filter(Boolean)
    : [
        "As a Frontend developer passionate about creating seamless web experiences & developing robust and problem-solving skills and proven experience in creating and designing software in a test-driven environment.",
        "My expertise spans front-end development, where I have good hands-on experience with HTML, CSS, JavaScript, TypeScript, ReactJs, NextJs, Material UI, and modern CSS for crafting sleek user interfaces.",
        "On the server side, my focus revolves around the reliable functioning of applications using Node.js and Express.js with MongoDB.",
      ];

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
        height: "auto",
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
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
                : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
            backgroundColor: theme.palette.background.paper,
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "dark"
                  ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                  : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4" sx={{ marginRight: 2, marginBottom: 1, fontWeight: 700 }}>
              About Me
            </Typography>
            {!isMobile && (
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

          {isLoading ? (
            <Box sx={{ my: 2 }}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
            </Box>
          ) : (
            aboutBullets.map((text, idx) => (
              <Typography
                key={idx}
                variant="body1"
                sx={{
                  marginBottom: "12px",
                  position: "relative",
                  paddingLeft: "14px",
                  lineHeight: 1.7,
                  color: theme.palette.text.secondary,
                  "&::before": {
                    content: '"•"',
                    position: "absolute",
                    left: 0,
                    color: theme.palette.primary.main || "#818cf8",
                    fontWeight: "bold",
                  },
                }}
              >
                {text}
              </Typography>
            ))
          )}

          <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
            What I do!
          </Typography>

          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 2,
                marginBottom: 2,
                marginTop: 2,
              }}
            >
              <InfoCard
                title="Frontend Development"
                content="As a Frontend Developer, I am captivated by creating dynamic and scalable web applications using my expertise in React.js and Next.js. I dive into projects that leverage these technologies, along with UI frameworks like MUI and modern CSS, to build fast, user-friendly applications."
                imageSrc={frontendImage}
              />
              <InfoCard
                title="Freelancer & Full-Stack"
                content="I specialize in building high-performance web applications with React.js, Node.js, and Express. Using modern UI principles and glassmorphic designs, I create scalable, responsive architectures tailored to client requirements with clean, testable code."
                imageSrc={freelancerImage}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
