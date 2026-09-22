/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, useTheme, useMediaQuery, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import InfoCard from "../components/InfoCard";
import SectionHeader from "../components/SectionHeader";
import SubHeading from "../components/SubHeading";
import { fetchUserProfile } from "../api/portfolioApi";

/**
 * Home page view.
 * Showcases profile summary, biographical overview, and core domain competencies.
 */
const Home = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const { username } = useParams();
  // Stack layout vertically on mobile and tablet to give full width to the menubar and content
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDarkMode = theme.palette.mode === "dark";

  const { data: user, isLoading } = useQuery({
    queryKey: ["portfolioUser", username],
    queryFn: () => fetchUserProfile(username),
  });

  // Only use actual bio from admin panel - no mock/hardcoded fallbacks
  const hasAboutMe = Boolean(user?.aboutMe && user.aboutMe.trim());
  const aboutBullets = hasAboutMe ? user.aboutMe.split("\n\n").filter(Boolean) : [];

  // Only use actual services if configured on the user in admin panel
  const servicesList = Array.isArray(user?.services)
    ? user.services.filter((s) => s && (s.title || s.content))
    : [];
  const hasServices = servicesList.length > 0;

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
      {/* Left Column: ProfileCard - centered with max-width on mobile/tablet, fixed width on desktop */}
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

      {/* Right Column: Menubar, Main Content Card - full width on mobile/tablet, flexible on desktop */}
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
          id="main-home-container"
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
          {isLoading ? (
            <Box sx={{ my: 2 }}>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={32} />
            </Box>
          ) : !hasAboutMe && !hasServices ? (
            <Box sx={{ my: 1 }}>
              <SectionHeader title="About" />
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 2,
                  lineHeight: 1.75,
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                }}
              >
                Welcome to my portfolio! Profile details and domain expertise will appear here once updated in the admin panel.
              </Typography>
            </Box>
          ) : (
            <>
              {hasAboutMe && (
                <>
                  <SectionHeader title="About Me" />
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, my: 1, mb: hasServices ? 3 : 1 }}>
                    {aboutBullets.map((text, idx) => (
                      <Typography
                        key={idx}
                        variant="body1"
                        sx={{
                          position: "relative",
                          paddingLeft: "20px",
                          lineHeight: 1.75,
                          fontSize: { xs: "0.9rem", sm: "0.95rem" },
                          color: theme.palette.text.secondary,
                          "&::before": {
                            content: '"•"',
                            position: "absolute",
                            left: 0,
                            top: "-2px",
                            color: isDarkMode ? "#818cf8" : "#4f46e5",
                            fontWeight: 700,
                            fontSize: "1.4rem",
                          },
                        }}
                      >
                        {text}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}

              {hasServices && (
                <>
                  <SubHeading title="What I do!" />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: 2.5,
                      mt: 1,
                    }}
                  >
                    {servicesList.map((srv, idx) => (
                      <InfoCard
                        key={srv.id || srv._id || idx}
                        title={srv.title || "Service"}
                        content={srv.content || ""}
                        imageSrc={srv.imageSrc || ""}
                      />
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Home);
