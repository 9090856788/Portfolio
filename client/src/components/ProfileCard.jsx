import React from "react";
import { Box, Avatar, IconButton, Typography, Button } from "@mui/material";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  GitHub,
  YouTube,
  Phone,
  Email,
  LocationOn,
  Download,
} from "@mui/icons-material";

const ProfileCard = () => {
  return (
    <Box
      className="Main Box"
      sx={{
        position: "relative",
        width: "auto",
        height: "85vh",
        border: "1px solid #e0e0e0",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        marginTop: 12,
        backgroundColor: "#fff",
      }}
    >
      {/* Overlapping Avatar */}
      <Box
        sx={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #fff",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <Avatar sx={{ width: "100%", height: "100%" }} />
      </Box>
      {/* Main content below the Avatar */}
      <Box
        sx={{
          // width: "",
          height: "20vh",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          marginTop: 12,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Kanhu Charan Sahoo
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Full Stack Developer
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          <IconButton
            href="https://www.facebook.com"
            target="_blank"
            aria-label="Facebook"
            sx={{ color: "#3b5998" }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            href="https://www.instagram.com"
            target="_blank"
            aria-label="Instagram"
            sx={{ color: "#e4405f" }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com"
            target="_blank"
            aria-label="LinkedIn"
            sx={{ color: "#0077b5" }}
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            href="https://twitter.com"
            target="_blank"
            aria-label="Twitter"
            sx={{ color: "#1da1f2" }}
          >
            <Twitter />
          </IconButton>
          <IconButton
            href="https://github.com"
            target="_blank"
            aria-label="GitHub"
            sx={{ color: "#333" }}
          >
            <GitHub />
          </IconButton>
          <IconButton
            href="https://www.youtube.com"
            target="_blank"
            aria-label="YouTube"
            sx={{ color: "#ff0000" }}
          >
            <YouTube />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          border: "1px solid #f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid grey",
            paddingBottom: 1,
          }}
        >
          <Phone sx={{ color: "#3f51b5" }} />
          <Typography variant="h6">9090856788</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid grey",
            paddingBottom: 1,
          }}
        >
          <Email sx={{ color: "#f44336" }} />
          <Typography variant="h6">kanhucharansahoo595@gmail.com</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid grey",
            paddingBottom: 1,
          }}
        >
          <LocationOn sx={{ color: "#4caf50" }} />
          <Typography variant="h6">Nayagarh, Odisha, India</Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{
            marginTop: 2,
            bgcolor: "#1976d2", // Primary color for the button
            color: "#fff",
            "&:hover": {
              bgcolor: "#1565c0", // Darker shade for hover effect
            },
          }}
        >
          Download Resume
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCard;
