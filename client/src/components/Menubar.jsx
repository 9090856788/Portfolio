import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const Menubar = () => {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: "80%",
          md: "70%",
          lg: "65%",
          xl: "60%",
        },
        height: "auto",
        display: "flex",
        justifyContent: {
          xs: "space-between",
          sm: "space-around",
        },
        alignItems: "center",
        padding: "10px",
        borderRadius: "10px",
        marginLeft: "auto",
        bgcolor: isDarkMode ? "grey.900" : "#e0e0e0",
        boxShadow: isDarkMode
          ? "inset 7px 7px 15px #333, inset -7px -7px 15px #000"
          : "7px 7px 15px #bebebe, -7px -7px 15px #ffffff",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {[
        { icon: <HomeIcon />, label: "Home" },
        { icon: <DescriptionIcon />, label: "Resume" },
        { icon: <WorkIcon />, label: "Work" },
        { icon: <ContactMailIcon />, label: "Contact" },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: {
              xs: 1,
              sm: 2,
            },
            bgcolor: isDarkMode ? "grey.800" : "#e0e0e0",
            borderRadius: "10px",
            boxShadow: isDarkMode
              ? "inset 4px 4px 8px #333, inset -4px -4px 8px #000"
              : "7px 7px 15px #bebebe, -7px -7px 15px #ffffff",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
            "&:hover": {
              boxShadow: isDarkMode
                ? "inset 7px 7px 15px #333, inset -7px -7px 15px #000"
                : "inset 7px 7px 15px #bebebe, inset -7px -7px 15px #ffffff",
            },
          }}
        >
          {item.icon}
          <Typography
            sx={{
              ml: 1,
              color: isDarkMode ? "#e0e0e0" : "inherit",
              display: { xs: "none", sm: "block" },
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Menubar;
