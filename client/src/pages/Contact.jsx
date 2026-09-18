/* eslint-disable react/prop-types */
import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import ContactForm from "../components/ContactForm";
import SectionHeader from "../components/SectionHeader";

/**
 * Contact page view.
 * Enables direct visitor outreach and message dispatches to the owner.
 */
const Contact = ({ toggleDarkMode }) => {
  const theme = useTheme();
  // Stack layout vertically on mobile and tablet to preserve clean spacing and menubar layout
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDarkMode = theme.palette.mode === "dark";

  const mainContainerShadow = isDarkMode
    ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
    : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`;

  const mainContainerHoverShadow = isDarkMode
    ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
    : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isTabletOrMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: isTabletOrMobile ? "center" : "flex-start",
        padding: { xs: "12px 10px", sm: "16px", md: "24px 20px" },
        margin: "0 auto",
        maxWidth: "1260px",
        width: "100%",
        gap: { xs: 2.5, md: 3 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Left Column: ProfileCard - centered on tablet/mobile, fixed on desktop */}
      <Box
        sx={{
          width: isTabletOrMobile ? "100%" : { md: "340px", lg: "360px" },
          maxWidth: isTabletOrMobile ? { xs: "100%", sm: "580px" } : "none",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        <ProfileCard />
      </Box>

      {/* Right Column: Menubar, Main Contact Container - dynamically expands */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: isTabletOrMobile ? "100%" : "auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Menubar toggleDarkMode={toggleDarkMode} />

        <Box
          id="main-contact-container"
          sx={{
            marginTop: "20px",
            padding: { xs: "20px 16px", sm: "24px 28px" },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px",
            boxShadow: mainContainerShadow,
            backgroundColor: theme.palette.background.paper,
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
            "&:hover": {
              boxShadow: mainContainerHoverShadow,
              transform: "translateY(-2px)",
            },
          }}
        >
          {/* Managed Section Header matching all other views */}
          <SectionHeader title="Contact Me" />

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: 2,
              mt: 1,
            }}
          >
            <ContactForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Contact);
