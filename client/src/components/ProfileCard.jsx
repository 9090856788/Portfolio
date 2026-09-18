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
 * Left-side portfolio identity card.
 * Styled with true neumorphism (dual light/dark shadows) and consistent dark/light mode background
 * matching the main content container.
 */
const ProfileCard = () => {
  const theme = useTheme();
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
      color: isDarkMode ? "#f8fafc" : "#1e293b",
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

  // Neumorphic shadow profiles aligned with the main container
  const cardShadow = isDarkMode
    ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
    : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`;

  const cardHoverShadow = isDarkMode
    ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
    : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`;

  return (
    <Box
      id="portfolio-profile-card"
      sx={{
        position: "relative",
        width: "100%",
        padding: { xs: "20px 16px", sm: "24px 20px" },
        borderRadius: "16px",
        boxShadow: cardShadow,
        marginTop: { xs: 8, sm: 9, md: 10 },
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        "&:hover": {
          boxShadow: cardHoverShadow,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Centered Avatar with Neumorphic circular frame */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-55px", sm: "-70px", md: "-85px" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "110px", sm: "135px", md: "160px" },
          height: { xs: "110px", sm: "135px", md: "160px" },
          borderRadius: "50%",
          p: "6px",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDarkMode
            ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
            : `6px 6px 14px ${theme.palette.grey[300]}, -6px -6px 14px ${theme.palette.grey[100]}`,
        }}
      >
        <Avatar
          alt={fullName}
          src={avatarSrc}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            border: `2px solid ${isDarkMode ? "rgba(129, 140, 248, 0.4)" : "rgba(79, 70, 229, 0.3)"}`,
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
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.45rem" },
              letterSpacing: "-0.02em",
              color: theme.palette.text.primary,
            }}
          >
            {fullName}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mt: 0.5,
            fontSize: "0.9rem",
          }}
        >
          {roleTitle}
        </Typography>

        {/* Neumorphic Social Icons Row */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 2 }}>
          {socialMediaLinks.map((link) => (
            <IconButton
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.background.paper,
                color: link.color,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDarkMode
                  ? `4px 4px 8px ${theme.palette.grey[900]}, -4px -4px 8px ${theme.palette.grey[800]}`
                  : `4px 4px 8px ${theme.palette.grey[300]}, -4px -4px 8px ${theme.palette.grey[100]}`,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "scale(1.06)",
                  boxShadow: isDarkMode
                    ? `inset 2px 2px 4px ${theme.palette.grey[900]}, inset -2px -2px 4px ${theme.palette.grey[800]}`
                    : `inset 2px 2px 4px ${theme.palette.grey[300]}, inset -2px -2px 4px ${theme.palette.grey[100]}`,
                },
              }}
            >
              {link.icon}
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Contact Quick Details: Neumorphic Inset/Debossed Container */}
      {/* Container automatically grows in height if email, phone or address is long */}
      <Box
        id="profile-contact-details"
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: "14px",
          p: { xs: 2, sm: 2.2 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDarkMode
            ? `inset 3px 3px 8px ${theme.palette.grey[900]}, inset -3px -3px 8px ${theme.palette.grey[800]}`
            : `inset 3px 3px 8px ${theme.palette.grey[300]}, inset -3px -3px 8px ${theme.palette.grey[100]}`,
        }}
      >
        {/* Phone Contact */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mt: 0.2,
              boxShadow: isDarkMode
                ? `3px 3px 6px ${theme.palette.grey[900]}, -3px -3px 6px ${theme.palette.grey[800]}`
                : `3px 3px 6px ${theme.palette.grey[300]}, -3px -3px 6px ${theme.palette.grey[100]}`,
            }}
          >
            <Phone sx={{ color: "#6366f1", fontSize: 18 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: theme.palette.text.secondary,
                lineHeight: 1.2,
                mb: 0.3,
              }}
            >
              Phone
            </Typography>
            <Typography
              component="a"
              href={`tel:${phone.replace(/\s+/g, "")}`}
              variant="body2"
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                textDecoration: "none",
                display: "block",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.35,
                transition: "color 0.2s ease",
                "&:hover": {
                  color: isDarkMode ? "#a5b4fc" : "#4f46e5",
                },
              }}
            >
              {phone}
            </Typography>
          </Box>
        </Box>

        {/* Email Contact - Fully expanded with word-break so full address is 100% visible */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mt: 0.2,
              boxShadow: isDarkMode
                ? `3px 3px 6px ${theme.palette.grey[900]}, -3px -3px 6px ${theme.palette.grey[800]}`
                : `3px 3px 6px ${theme.palette.grey[300]}, -3px -3px 6px ${theme.palette.grey[100]}`,
            }}
          >
            <Email sx={{ color: "#ef4444", fontSize: 18 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: theme.palette.text.secondary,
                lineHeight: 1.2,
                mb: 0.3,
              }}
            >
              Email
            </Typography>
            <Typography
              component="a"
              href={`mailto:${email}`}
              variant="body2"
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                textDecoration: "none",
                display: "block",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.35,
                transition: "color 0.2s ease",
                "&:hover": {
                  color: isDarkMode ? "#a5b4fc" : "#4f46e5",
                },
              }}
            >
              {email}
            </Typography>
          </Box>
        </Box>

        {/* Location Contact - Expands cleanly to accommodate multiline state/country info */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mt: 0.2,
              boxShadow: isDarkMode
                ? `3px 3px 6px ${theme.palette.grey[900]}, -3px -3px 6px ${theme.palette.grey[800]}`
                : `3px 3px 6px ${theme.palette.grey[300]}, -3px -3px 6px ${theme.palette.grey[100]}`,
            }}
          >
            <LocationOn sx={{ color: "#10b981", fontSize: 18 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: theme.palette.text.secondary,
                lineHeight: 1.2,
                mb: 0.3,
              }}
            >
              Location
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: "block",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.35,
              }}
            >
              {location}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Neumorphic Download Resume Button */}
      <Button
        id="btn-download-resume"
        variant="text"
        fullWidth
        startIcon={<Download sx={{ fontSize: 20 }} />}
        onClick={handleResumeDownload}
        sx={{
          mt: 2.5,
          py: 1.3,
          borderRadius: "14px",
          bgcolor: theme.palette.background.paper,
          color: isDarkMode ? "#a5b4fc" : "#4f46e5",
          border: `1px solid ${theme.palette.divider}`,
          fontWeight: 700,
          fontSize: "0.92rem",
          textTransform: "none",
          boxShadow: isDarkMode
            ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
            : `6px 6px 14px ${theme.palette.grey[300]}, -6px -6px 14px ${theme.palette.grey[100]}`,
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: isDarkMode
              ? `8px 8px 18px ${theme.palette.grey[900]}, -8px -8px 18px ${theme.palette.grey[800]}`
              : `8px 8px 18px ${theme.palette.grey[400]}, -8px -8px 18px ${theme.palette.grey[100]}`,
            bgcolor: isDarkMode ? "rgba(129, 140, 248, 0.08)" : "rgba(79, 70, 229, 0.04)",
          },
          "&:active": {
            transform: "translateY(1px)",
            boxShadow: isDarkMode
              ? `inset 3px 3px 6px ${theme.palette.grey[900]}, inset -3px -3px 6px ${theme.palette.grey[800]}`
              : `inset 3px 3px 6px ${theme.palette.grey[300]}, inset -3px -3px 6px ${theme.palette.grey[100]}`,
          },
        }}
      >
        Download Resume
      </Button>
    </Box>
  );
};

export default React.memo(ProfileCard);
