import React, { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const [avatar, setAvatar] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      const response = await fetch("https://api.example.com/download-resume");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the resume:", error);
    }
  };

  const renderSocialMediaIcons = () =>
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
    ));

  const renderContactInfo = (Icon, text, color) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderBottom: "1px solid grey",
        paddingBottom: 1,
      }}
    >
      <Icon sx={{ color }} />
      <Typography variant="h6" sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: isMobile ? "90%" : "auto",
        height: "85vh",
        border: "1px solid #e0e0e0",
        padding: isMobile ? "10px" : "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        marginTop: isMobile ? 6 : 12,
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? "-60px" : "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? "120px" : "200px",
          height: isMobile ? "120px" : "200px",
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
          src={avatar}
          sx={{ width: "100%", height: "100%" }}
          onClick={() => document.getElementById("avatarInput").click()}
        />
        <input
          type="file"
          id="avatarInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </Box>

      <Box
        sx={{
          height: "20vh",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          marginTop: isMobile ? 8 : 12,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
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
          {renderSocialMediaIcons()}
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
        {renderContactInfo(Phone, "9090856788", "#3f51b5")}
        {renderContactInfo(Email, "kanhucharansahoo595@gmail.com", "#f44336")}
        {renderContactInfo(LocationOn, "Nayagarh, Odisha, India", "#4caf50")}
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleResumeDownload}
          sx={{
            marginTop: 2,
            bgcolor: "#1976d2",
            color: "#fff",
            "&:hover": { bgcolor: "#1565c0" },
            fontSize: isMobile ? "0.75rem" : "1rem",
          }}
        >
          Download Resume
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCard;
