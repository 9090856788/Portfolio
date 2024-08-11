import React from "react";
import { Box, useTheme, useMediaQuery, Typography } from "@mui/material";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";

const mockInfoCardData = [
  { title: "Experience", content: "4 years of experience in IT." },
  { title: "Skills", content: "JavaScript, React, Redux, etc." },
  {
    title: "Projects",
    content: "Developed various projects in web development.",
  },
  {
    title: "Projects",
    content: "Developed various projects in web development.",
  },
];

const Home = ({ toggleDarkMode }) => {
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
            About Me
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            pulvinar, ipsum vel condimentum luctus, neque metus ultricies
            lectus, vel semper nisi ligula non arcu. Sed et arcu lacinia,
            dignissim lectus at, ullamcorper neque. Nulla facilisi. Sed sed
            fermentum neque, vel varius ipsum. Integer id mauris at dui
            consectetur pulvinar. Donec vel velit vel neque vulputate semper.
            Proin in consectetur nisi. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed pulvinar, ipsum vel condimentum luctus, neque
            metus ultricies lectus, vel semper nisi ligula non arcu. Sed et arcu
            lacinia, dignissim lectus at, ullamcorper neque. Nulla facilisi. Sed
            sed fermentum neque, vel varius ipsum. Integer id mauris at dui
            consectetur pulvinar. Donec vel velit vel neque vulputate semper.
            Proin in consectetur nisi.
          </Typography>
          <Typography variant="h5">What I do!</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            {mockInfoCardData.map((data, index) => (
              <InfoCard key={index} title={data.title} content={data.content} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
