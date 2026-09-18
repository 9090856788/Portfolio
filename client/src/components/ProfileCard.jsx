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
  Skeleton,
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

/**
 * ProfileCard component
 * Displays user identity, contact details, social links, and resume download.
 * Responsive with optical hierarchy and balanced neumorphic surfaces.
 */
const ProfileCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDarkMode = theme.palette.mode === "dark";

  const { data: user, isLoading } = useQuery({
    queryKey: ["portfolioUser"],
    queryFn: fetchUserProfile,
  });

  const avatarSrc = user?.avatar?.url || profileImg;
  const fullName = user?.fullName || "Kanhu Charan Sahoo";
  const roleTitle = user?.role || "Frontend Developer & UI/UX Specialist";
  const phone = user?.phone || "+91 9090856788";
  const email = user?.email || "kanhucharansahoo595@gmail.com";
  const location = user?.location || "Bhubaneswar, Odisha, India";
  const resumeUrl = user?.resume?.url || "";

  const socialMediaLinks = [
    {
      name: "LinkedIn",
      url: user?.linkedInURL || "https://linkedin.com/in/kanhucharansahoo",
      icon: <LinkedIn fontSize="small" />,
      color: "#0077b5",
    },
    {
      name: "Twitter",
      url: user?.twitterURL || "https://twitter.com",
      icon: <Twitter fontSize="small" />,
      color: "#1da1f2",
    },
    {
      name: "GitHub",
      url: user?.githubURL || "https://github.com/9090856788",
      icon: <GitHub fontSize="small" />,
      color: isDarkMode ? "#ffffff" : "#1e293b",
    },
  ];

  // Handles resume download or falls back to generating a contact summary file
  const handleResumeDownload = () => {
    if (resumeUrl && resumeUrl.startsWith("http")) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    } else {
      const summaryContent = [
        `Candidate: ${fullName}`,
        `Title: ${roleTitle}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Location: ${location}`,
        `Portfolio: ${user?.portfolioURL || window.location.origin}`,
      ].join("\n");

      const blob = new Blob([summaryContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fullName.replace(/\s+/g, "_")}_Profile.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

  const cardShadow = isDarkMode
    ? "8px 8px 20px rgba(0, 0, 0, 0.5), -4px -4px 14px rgba(255, 255, 255, 0.02)"
    : "8px 8px 20px rgba(0, 0, 0, 0.06), -4px -4px 14px rgba(255, 255, 255, 0.95)";

  return (
    <Box
      id="portfolio-profile-card"
      sx={{
        position: "relative",
        width: "100%",
        padding: { xs: "20px 16px", sm: "24px 20px" },
        borderRadius: "20px",
        boxShadow: cardShadow,
        marginTop: { xs: 8, sm: 9, md: 10 },
        backgroundColor: isDarkMode ? "rgba(22, 26, 38, 0.9)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"}`,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* Centered Avatar with subtle ring glow */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-55px", sm: "-70px", md: "-85px" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "110px", sm: "135px", md: "160px" },
          height: { xs: "110px", sm: "135px", md: "160px" },
          borderRadius: "50%",
          p: "4px",
          backgroundColor: isDarkMode ? "#1e2235" : "#ffffff",
          boxShadow: isDarkMode
            ? "0 10px 25px rgba(0, 0, 0, 0.6)"
            : "0 10px 25px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Avatar
          alt={fullName}
          src={avatarSrc}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            border: `2px solid ${isDarkMode ? "rgba(129, 140, 248, 0.4)" : "rgba(99, 102, 241, 0.3)"}`,
          }}
        />
      </Box>

      {/* Name and Designation */}
      <Box sx={{ textAlign: "center", mt: { xs: 7, sm: 8, md: 9.5 }, mb: 2 }}>
        {isLoading ? (
          <Skeleton variant="text" width="60%" sx={{ mx: "auto", height: 36 }} />
        ) : (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.45rem" },
              letterSpacing: "-0.02em",
              color: isDarkMode ? "#f8fafc" : "#0f172a",
            }}
          >
            {fullName}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? "#94a3b8" : "#64748b",
            fontWeight: 500,
            mt: 0.5,
            fontSize: "0.9rem",
          }}
        >
          {roleTitle}
        </Typography>

        {/* Social Links Row */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 2 }}>
          {socialMediaLinks.map((link) => (
            <IconButton
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              sx={{
                width: 38,
                height: 38,
                bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                color: link.color,
                border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"}`,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              {link.icon}
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Contact Quick Details */}
      <Box
        sx={{
          bgcolor: isDarkMode ? "rgba(15, 18, 28, 0.6)" : "rgba(248, 250, 252, 0.8)",
          borderRadius: "14px",
          p: { xs: 1.8, sm: 2.2 },
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Phone sx={{ color: "#6366f1", fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: isDarkMode ? "#cbd5e1" : "#334155",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {phone}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Email sx={{ color: "#ef4444", fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: isDarkMode ? "#cbd5e1" : "#334155",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <LocationOn sx={{ color: "#10b981", fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: isDarkMode ? "#cbd5e1" : "#334155",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {location}
          </Typography>
        </Box>
      </Box>

      {/* Download Resume Button */}
      <Button
        id="btn-download-resume"
        variant="contained"
        fullWidth
        startIcon={<Download />}
        onClick={handleResumeDownload}
        sx={{
          mt: 2.5,
          py: 1.2,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: "0.92rem",
          textTransform: "none",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 6px 18px rgba(99, 102, 241, 0.5)",
          },
        }}
      >
        Download Resume
      </Button>
    </Box>
  );
};

export default ProfileCard;
