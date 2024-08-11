import React from "react";
import { Box, IconButton } from "@mui/material";
import Menubar from "../components/Menubar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import { Facebook } from "@mui/icons-material";
import InfoCard from "../components/InfoCard.jsx";

const About = () => {
  return (
    <>
      <Box
        className="Main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          background: "white",
          margin: 5,
        }}
      >
        <Box
          className="LeftSide"
          sx={{
            width: "35%",
            height: "100vh",
            // border: "1px solid blue",
          }}
        >
          <ProfileCard />
        </Box>
        <Box
          className="Right Side"
          sx={{
            width: "65%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Menubar />
          <Box
            sx={{
              width: "auto",
              marginTop: 2.6,
              marginLeft: 1,
              padding: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: "2%",
            }}
          >
            <h1>About Me</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              pulvinar, ipsum vel condimentum luctus, neque metus ultricies
              lectus, vel semper nisi ligula non arcu. Sed et arcu lacinia,
              dignissim lectus at, ullamcorper neque. Nulla facilisi. Sed sed
              fermentum neque, vel varius ipsum. Integer id mauris at dui
              consectetur pulvinar. Donec vel velit vel neque vulputate semper.
              Proin in consectetur nisi.
            </p>
            <h2>What I do!</h2>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InfoCard />
              <InfoCard />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InfoCard />
              <InfoCard />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default About;
