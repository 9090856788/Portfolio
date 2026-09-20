/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Chip,
  Skeleton,
} from "@mui/material";
import { GitHub, Launch } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import SectionHeader from "../components/SectionHeader";
import { fetchProjects } from "../api/portfolioApi";
import frontendImage from "../img/frontendImage.jpg";

/**
 * Projects gallery view.
 * Highlights web applications, repositories, live deployments, and stack tags.
 */
const Project = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const { username } = useParams();
  // Responsive breakpoints: tablet/mobile stack for columns, mobile for inner grid
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDarkMode = theme.palette.mode === "dark";

  // Fetch projects from backend store / database
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", username],
    queryFn: () => fetchProjects(username),
  });

  const mainContainerShadow = isDarkMode
    ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
    : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`;

  const mainContainerHoverShadow = isDarkMode
    ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
    : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`;

  const cardShadow = isDarkMode
    ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
    : `6px 6px 14px ${theme.palette.grey[300]}, -6px -6px 14px ${theme.palette.grey[100]}`;

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
      {/* Left Column: Personal Profile Card - centered on tablet/mobile, fixed on desktop */}
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

      {/* Right Column: Navigation & Project Showcase - dynamically expands */}
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
          id="main-projects-container"
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
          <SectionHeader title="Portfolio Projects" />

          {isLoading ? (
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 2.5, mt: 1 }}>
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} variant="rectangular" height={260} sx={{ borderRadius: 3 }} />
              ))}
            </Box>
          ) : projects && projects.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2.5,
                mt: 1,
              }}
            >
              {projects.map((proj) => {
                const bannerSrc = proj.projectBanner?.url || frontendImage;
                const techList = proj.technology
                  ? proj.technology.split(",").map((t) => t.trim())
                  : [proj.stack || "Web"];

                return (
                  <Box
                    key={proj._id}
                    id={`project-card-${proj._id}`}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "16px",
                      borderRadius: "14px",
                      bgcolor: theme.palette.background.default,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: cardShadow,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <div>
                      {/* Project Preview Thumbnail */}
                      <Box
                        component="img"
                        src={bannerSrc}
                        alt={proj.title}
                        sx={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          mb: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      />

                      {/* Project Title & Stack Pill */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                          {proj.title}
                        </Typography>
                        {proj.stack && (
                          <Chip
                            label={proj.stack}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              bgcolor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "rgba(79, 70, 229, 0.1)",
                              color: isDarkMode ? "#a5b4fc" : "#4338ca",
                              borderRadius: "6px",
                            }}
                          />
                        )}
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mt: 1,
                          fontSize: "0.86rem",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {proj.description}
                      </Typography>

                      {/* Tech Chips */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mt: 1.5 }}>
                        {techList.map((t, idx) => (
                          <Chip
                            key={idx}
                            label={t}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              borderRadius: "6px",
                              borderColor: theme.palette.divider,
                            }}
                          />
                        ))}
                      </Box>
                    </div>

                    {/* Neumorphic External Project Links */}
                    <Box sx={{ display: "flex", gap: 1.2, mt: 2.5 }}>
                      {proj.projectLink && (
                        <Button
                          variant="text"
                          size="small"
                          href={proj.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<Launch fontSize="small" />}
                          sx={{
                            flex: 1,
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 700,
                            bgcolor: theme.palette.background.paper,
                            color: isDarkMode ? "#818cf8" : "#4f46e5",
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: isDarkMode
                              ? `4px 4px 10px ${theme.palette.grey[900]}, -4px -4px 10px ${theme.palette.grey[800]}`
                              : `4px 4px 10px ${theme.palette.grey[300]}, -4px -4px 10px ${theme.palette.grey[100]}`,
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: isDarkMode
                                ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
                                : `6px 6px 14px ${theme.palette.grey[400]}, -6px -6px 14px ${theme.palette.grey[100]}`,
                            },
                          }}
                        >
                          Live App
                        </Button>
                      )}
                      {proj.gitRepoLink && (
                        <Button
                          variant="text"
                          size="small"
                          href={proj.gitRepoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<GitHub fontSize="small" />}
                          sx={{
                            flex: proj.projectLink ? "0 0 auto" : 1,
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 700,
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: isDarkMode
                              ? `4px 4px 10px ${theme.palette.grey[900]}, -4px -4px 10px ${theme.palette.grey[800]}`
                              : `4px 4px 10px ${theme.palette.grey[300]}, -4px -4px 10px ${theme.palette.grey[100]}`,
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: isDarkMode
                                ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
                                : `6px 6px 14px ${theme.palette.grey[400]}, -6px -6px 14px ${theme.palette.grey[100]}`,
                            },
                          }}
                        >
                          Code
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
              No portfolio projects posted yet.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Project);
