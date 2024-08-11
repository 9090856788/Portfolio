import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        padding: isMobile ? "10px" : "20px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        position: "relative",
        bottom: 0,
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        © 2024 Kanhu Charan Sahoo. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
