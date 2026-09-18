/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
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
import Menubar from "../components/Menubar";
import ProfileCard from "../components/ProfileCard";
import { fetchProjects } from "../api/portfolioApi";
import frontendImage from "../img/frontendImage.jpg";

/**
 * Projects gallery view.
 * Highlights web applications, repositories, live deployments, and stack tags.
 */
const Project = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDarkMode = theme.palette.mode === "dark";

  // Fetch projects from backend store / database
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const sectionShadow = isDarkMode
    ? "8px 8px 20px rgba(0,0,0,0.5), -4px -4px 14px rgba(255,255,255,0.02)"
    : "8px 8px 20px rgba(0,0,0,0.06), -4px -4px 14px rgba(255,255,255,0.9)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : isTablet ? "row" : "row",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
        margin: "0 auto",
        maxWidth: "1200px",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Left Column: Personal Profile Card */}
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "45%" : "35%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
          boxSizing: "border-box",
        }}
      >
        <ProfileCard />
      </Box>

      {/* Right Column: Navigation & Project Showcase */}
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "55%" : "65%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Menubar toggleDarkMode={toggleDarkMode} />

        <Box
          sx={{
            marginTop: "20px",
            padding: { xs: "18px", sm: "24px" },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px",
            boxShadow: sectionShadow,
            backgroundColor: theme.palette.background.paper,
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ marginRight: 2, fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
              Portfolio Projects
            </Typography>
            {!isMobile && (
              <Box
                component="hr"
                sx={{
                  flexGrow: 1,
                  border: 0,
                  borderTop: "2px solid",
                  borderColor: "currentColor",
                  margin: 0,
                  opacity: 0.2,
                }}
              />
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 2.5 }}>
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
                      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                      boxShadow: sectionShadow,
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
                          border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
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
                              bgcolor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "rgba(99, 102, 241, 0.1)",
                              color: isDarkMode ? "#a5b4fc" : "#4338ca",
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
                              borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                            }}
                          />
                        ))}
                      </Box>
                    </div>

                    {/* External Project Links */}
                    <Box sx={{ display: "flex", gap: 1.2, mt: 2.5 }}>
                      {proj.projectLink && (
                        <Button
                          variant="contained"
                          size="small"
                          href={proj.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<Launch fontSize="small" />}
                          sx={{
                            flex: 1,
                            textTransform: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          }}
                        >
                          Live App
                        </Button>
                      )}
                      {proj.gitRepoLink && (
                        <Button
                          variant="outlined"
                          size="small"
                          href={proj.gitRepoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<GitHub fontSize="small" />}
                          sx={{
                            flex: proj.projectLink ? "0 0 auto" : 1,
                            textTransform: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
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

export default Project;
