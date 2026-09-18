/* eslint-disable no-unused-vars */
import React from "react";
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  LinkedIn,
  Twitter,
  GitHub,
  Phone,
  Email,
  LocationOn,
  Download,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/portfolioApi";
import profileImg from "../img/Kanhu.jpg";

const ProfileCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { data: user, isLoading } = useQuery({
    queryKey: ["portfolioUser"],
    queryFn: fetchUserProfile,
  });

  const avatarSrc = user?.avatar?.url || profileImg;
  const fullName = user?.fullName || "Kanhu Charan Sahoo";
  const roleTitle = user?.role || "Frontend Developer & UI/UX";
  const phone = user?.phone || "+91 9090856788";
  const email = user?.email || "kanhucharansahoo595@gmail.com";
  const location = user?.location || "Bhubaneswar, Odisha, India";
  const resumeUrl = user?.resume?.url || "";

  const socialMediaLinks = [
    {
      name: "LinkedIn",
      url: user?.linkedInURL || "https://linkedin.com",
      icon: <LinkedIn />,
      color: "#0077b5",
    },
    {
      name: "Twitter",
      url: user?.twitterURL || "https://twitter.com",
      icon: <Twitter />,
      color: "#1da1f2",
    },
    {
      name: "GitHub",
      url: user?.githubURL || "https://github.com/9090856788",
      icon: <GitHub />,
      color: "#333",
    },
  ];

  const handleResumeDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      // Fallback resume notification or download
      const element = document.createElement("a");
      const file = new Blob([
        `Resume: ${fullName}\nRole: ${roleTitle}\nEmail: ${email}\nPhone: ${phone}\nPortfolio: ${user?.portfolioURL || "https://kanhucharansahoo.dev"}`
      ], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${fullName.replace(/\s+/g, "_")}_Resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const renderSocialMediaIcons = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        padding: 2,
        borderRadius: "10px",
        boxShadow:
          theme.palette.mode === "dark"
            ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
              : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {socialMediaLinks.map((link) => (
        <IconButton
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          sx={{
            bgcolor: theme.palette.background.default,
            color:
              link.name === "GitHub"
                ? theme.palette.mode === "dark"
                  ? "white"
                  : link.color
                : link.color,
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
                : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
            transition: "box-shadow 0.3s ease, transform 0.3s ease, background-color 0.3s ease",
            "&:hover": {
              bgcolor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
              boxShadow:
                theme.palette.mode === "dark"
                  ? `inset 8px 8px 15px ${theme.palette.grey[900]}, inset -8px -8px 15px ${theme.palette.grey[800]}`
                  : `inset 8px 8px 15px ${theme.palette.grey[300]}, inset -8px -8px 15px ${theme.palette.grey[100]}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          {link.icon}
        </IconButton>
      ))}
    </Box>
  );

  const renderContactInfo = (Icon, text, color) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        paddingBottom: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <Icon sx={{ color, fontSize: { xs: 20, sm: 24 } }} />
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "0.875rem", sm: "1rem", md: "1.05rem" },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          maxWidth: "calc(100% - 40px)",
        }}
      >
        {text}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "auto",
        height: "auto",
        padding: isMobile ? "15px" : "20px",
        borderRadius: "16px",
        boxShadow:
          theme.palette.mode === "dark"
            ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        marginTop: isMobile ? 6 : isTablet ? 8 : 12,
        backgroundColor: theme.palette.background.paper,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
              : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Dynamic Avatar Container */}
      <Box
        sx={{
          position: "absolute",
          top: isMobile || isTablet ? "-60px" : "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile || isTablet ? "120px" : "200px",
          height: isMobile || isTablet ? "120px" : "200px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid transparent",
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e2f" : "#ffffff",
          boxShadow:
            theme.palette.mode === "dark"
              ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
              : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        }}
      >
        <Avatar
          alt={fullName}
          src={avatarSrc}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
                : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
          }}
        />
      </Box>

      {/* User Information */}
      <Box
        sx={{
          height: "auto",
          padding: "10px",
          backgroundColor: theme.palette.background.paper,
          marginTop: isMobile || isTablet ? 8 : 12,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 0.5 }}>
            {fullName}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
          >
            {roleTitle}
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

      {/* Contact Details & Resume Action */}
      <Box
        sx={{
          border: "1px solid transparent",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
          borderRadius: "8px",
          boxShadow:
            theme.palette.mode === "dark"
              ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
              : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            boxShadow:
              theme.palette.mode === "dark"
                ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
            transform: "translateY(-2px)",
          },
        }}
      >
        {renderContactInfo(Phone, phone, "#3f51b5")}
        {renderContactInfo(Email, email, "#f44336")}
        {renderContactInfo(LocationOn, location, "#4caf50")}
        <Button
          id="btn-download-resume"
          variant="contained"
          startIcon={<Download />}
          onClick={handleResumeDownload}
          sx={{
            marginTop: 2,
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: "50px",
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
                : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
            transition: "box-shadow 0.3s ease, transform 0.3s ease, background-color 0.3s ease",
            "&:hover": {
              bgcolor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
              boxShadow:
                theme.palette.mode === "dark"
                  ? `inset 8px 8px 15px ${theme.palette.grey[900]}, inset -8px -8px 15px ${theme.palette.grey[800]}`
                  : `inset 8px 8px 15px ${theme.palette.grey[300]}, inset -8px -8px 15px ${theme.palette.grey[100]}`,
              transform: "translateY(-2px)",
            },
            fontSize: isMobile ? "0.75rem" : isTablet ? "0.85rem" : "1rem",
            padding: isMobile ? "6px 12px" : isTablet ? "8px 16px" : "10px 20px",
          }}
        >
          Download Resume
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCard;
