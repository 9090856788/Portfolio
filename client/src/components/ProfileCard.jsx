import React, { useState } from "react";
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
// import axios from 'axios'; // Import axios

const socialMediaLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: <Facebook />,
    color: "#3b5998",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: <Instagram />,
    color: "#e4405f",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    icon: <LinkedIn />,
    color: "#0077b5",
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: <Twitter />,
    color: "#1da1f2",
  },
  {
    name: "GitHub",
    url: "https://github.com",
    icon: <GitHub />,
    color: "#333",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: <YouTube />,
    color: "#ff0000",
  },
];

const ProfileCard = () => {
  const [avatar, setAvatar] = useState(""); // Profile Card specific avatar state

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeDownload = async () => {
    try {
      const response = await fetch("https://api.example.com/download-resume", {
        responseType: "blob", // Ensure response is treated as a binary blob
      });

      // Create a link element
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf"); // Filename for the downloaded file

      // Append the link to the body and trigger a click to start the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the resume:", error);
    }
  };

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
          cursor: "pointer",
        }}
      >
        <Avatar
          alt="User Avatar"
          src={avatar} // Use Profile Card's specific avatar state
          sx={{ width: "100%", height: "100%" }}
          onClick={() =>
            document.getElementById("avatarInputForMainUserProfile").click()
          }
        />
        <input
          type="file"
          id="avatarInputForMainUserProfile"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </Box>
      {/* Main content below the Avatar */}
      <Box
        sx={{
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
          {socialMediaLinks &&
            socialMediaLinks.map((link) => (
              <IconButton
                key={link.name}
                href={link.url}
                target="_blank"
                aria-label={link.name}
                sx={{ color: link.color }}
              >
                {link.icon}
              </IconButton>
            ))}
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
          onClick={handleResumeDownload} // Trigger resume download
          sx={{
            marginTop: 2,
            bgcolor: "#1976d2",
            color: "#fff",
            "&:hover": {
              bgcolor: "#1565c0",
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
