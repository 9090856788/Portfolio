/* eslint-disable no-unused-vars */
import React from "react";
import { Avatar, Button, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: { xs: "5px", sm: "10px" }, // Responsive padding
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Stack items vertically on small screens
        justifyContent: "space-between", // Space between items
        alignItems: "center",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f4f4f4",
        marginBottom: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: { xs: "100%", sm: "auto" }, // Full width on small screens, auto width on larger screens
          marginBottom: { xs: "10px", sm: "0" }, // Margin bottom on small screens
        }}
      >
        <Link to="/">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              marginLeft: { xs: 0, sm: 1.8 }, // Adjust margin for different screen sizes
              cursor: "pointer",
            }}
          />
        </Link>

        <Typography variant="h6" sx={{ marginLeft: { xs: 0, sm: 2 } }}>
          Kanhu
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: "50%" }, // Full width on small screens
          display: "flex",
          justifyContent: "center", // Center the search input
        }}
      >
        <SearchIcon
          sx={{
            position: "absolute",
            left: { xs: "10px", sm: "15px" }, // Adjust icon position for different screen sizes
            top: "50%",
            transform: "translateY(-50%)",
            color: "#888",
          }}
        />
        <input
          type="text"
          placeholder="Search..."
          style={{
            width: "100%", // Full width of the container
            height: "6.5vh",
            padding: "10px 20px 10px 40px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            outline: "none",
            boxShadow:
              "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
          }}
        />
      </Box>
      <Link to="/login">
        <Button
          variant="outlined"
          sx={{
            marginRight: 5,
          }}
        >
          Login
        </Button>
      </Link>
    </Box>
  );
};

export default TopNavbar;
