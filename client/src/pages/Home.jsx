import React from "react";
import { Box, IconButton } from "@mui/material";
import Menubar from "../components/Menubar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import { Facebook } from "@mui/icons-material";

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
            border: "1px solid red",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Menubar />
          <Box
            sx={{
              width: "auto",
              // height: "100vh",
              border: "1px solid red",
              marginTop: 2.6,
              marginLeft: 1,
              padding: 2,
              backgroundColor: "#f5f5f5",
              // display: "flex",
              // flexDirection: "column",
              // justifyContent: "center",
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
                width: "auto",
                height: "48vh",
                border: "1px solid red",
                marginTop: 2.6,
                // marginLeft: 1,
                padding: 2,
                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                borderRadius: "2%",
              }}
            >
              <Box
                className="Parent div"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "2%",
                  backgroundColor: "#ffeb3b",
                  cursor: "pointer",
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  flexDirection: "column",
                  border: "1px solid pink",
                }}
              >
                <Box
                  className="box"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid red",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "2%",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    <IconButton>
                      <Facebook />
                    </IconButton>
                    <p>Full Stack Development</p>
                  </Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Amet, dolorem!
                  </p>
                </Box>

                <Box
                  className="box"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid red",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "2%",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    <IconButton>
                      <Facebook />
                    </IconButton>
                    <p>Frontend Development</p>
                  </Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Amet, dolorem!
                  </p>
                </Box>
              </Box>

              <Box
                className="Parent div"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "2%",
                  backgroundColor: "#ffeb3b",
                  cursor: "pointer",
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  flexDirection: "column",
                  border: "1px solid pink",
                }}
              >
                <Box
                  className="box"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid red",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "2%",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    <IconButton>
                      <Facebook />
                    </IconButton>
                    <p>Web Development</p>
                  </Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Amet, dolorem!
                  </p>
                </Box>

                <Box
                  className="box"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid red",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "2%",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    <IconButton>
                      <Facebook />
                    </IconButton>
                    <p>React Development</p>
                  </Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Amet, dolorem!
                  </p>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default About;
