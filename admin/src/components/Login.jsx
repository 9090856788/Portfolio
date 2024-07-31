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
} from "@mui/material";

const LoginForm = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem",
          borderRadius: "1rem",
          boxShadow: "7px 7px 15px #bebebe, -7px -7px 15px #ffffff",
          backgroundColor: "#e0e0e0",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: 5,
          }}
        >
          Admin Panel
        </Typography>
        <TextField
          variant="outlined"
          label="Email"
          sx={{
            marginBottom: "1rem",
            width: "100%",
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
            marginBottom: "1rem",
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "1rem",
              boxShadow:
                "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "1rem",
            boxShadow: "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
            padding: "0.5rem 2rem",
            marginBottom: "1rem",
          }}
        >
          Submit
        </Button>
        <Link
          href="/forgot/password"
          underline="hover"
          sx={{ marginBottom: "1rem", color: "#0000EE" }}
        >
          Forgot Password?
        </Link>
        <Typography>
          Don't have an account?{" "}
          <Link href="signup" underline="hover" sx={{ color: "#0000EE" }}>
            Create Account
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginForm;
