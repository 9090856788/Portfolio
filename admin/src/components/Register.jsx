/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  Avatar,
  Input,
} from "@mui/material";

const SignUp = () => {
  return (
    <>
      <Box>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "white",
            padding: "1rem",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "1rem",
              boxShadow: "7px 7px 15px #bebebe, -7px -7px 15px #ffffff",
              backgroundColor: "#e0e0e0",
              padding: "2rem",
            }}
          >
            <h1 style={{ marginBottom: 5 }}>Signup</h1>
            <p style={{ marginBottom: 15 }}>
              Please fill all the details below to avoid errors
            </p>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: "1rem",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <TextField
                variant="outlined"
                label="Full Name"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
              <TextField
                variant="outlined"
                label="Email"
                type="email"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: "1rem",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <TextField
                variant="outlined"
                label="Phone Number"
                type="number"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
              <TextField
                variant="outlined"
                label="Password"
                type="password"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: "1rem",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <TextField
                variant="outlined"
                label="About me"
                multiline
                rows={4}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
              <TextField
                variant="outlined"
                label="Portfolio URL"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
            </Box>

            {/* Adding the Avatar Upload Field */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <Typography variant="body1">Upload Avatar</Typography>
              <Input
                type="file"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
            </Box>

            {/* Adding the Resume Upload Field */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <Typography variant="body1">Upload Resume</Typography>
              <Input
                type="file"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "1rem",
                    boxShadow:
                      "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
                  },
                }}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: "1rem",
                boxShadow: "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
                padding: "0.5rem 2rem",
                marginBottom: "1rem",
              }}
            >
              Register
            </Button>

            <Typography>
              Already have an account?{" "}
              <Link href="/login" underline="hover" sx={{ color: "#0000EE" }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SignUp;
