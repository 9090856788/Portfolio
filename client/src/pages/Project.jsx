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

const Project = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDarkMode = theme.palette.mode === "dark";

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

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
      {/* Left Section: ProfileCard */}
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "45%" : "35%",
          padding: isMobile ? "10px" : isTablet ? "15px" : "20px",
          boxSizing: "border-box",
        }}
      >
        <ProfileCard />
      </Box>

      {/* Right Section: Menubar, Projects List */}
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
            padding: "20px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px",
            boxShadow: isDarkMode
              ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
              : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
            backgroundColor: theme.palette.background.paper,
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
            "&:hover": {
              boxShadow: isDarkMode
                ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ marginRight: 2, fontWeight: 700 }}>
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
                }}
              />
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 2 }}>
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} variant="rectangular" height={260} sx={{ borderRadius: 3 }} />
              ))}
            </Box>
          ) : projects && projects.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
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
                      boxShadow: isDarkMode
                        ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
                        : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: isDarkMode
                          ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                          : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
                      },
                    }}
                  >
                    <Box>
                      {/* Project Image Banner */}
                      <Box
                        sx={{
                          width: "100%",
                          height: "160px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          mb: 2,
                          bgcolor: isDarkMode ? "#13141f" : "#f1f3f7",
                        }}
                      >
                        <img
                          src={bannerSrc}
                          alt={proj.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = frontendImage;
                          }}
                        />
                      </Box>

                      {/* Project Title */}
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {proj.title}
                      </Typography>

                      {/* Project Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        {proj.description}
                      </Typography>

                      {/* Tech Chips */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2 }}>
                        {techList.slice(0, 4).map((tech, i) => (
                          <Chip
                            key={i}
                            label={tech}
                            size="small"
                            sx={{
                              fontSize: "0.72rem",
                              borderRadius: "6px",
                              bgcolor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "rgba(99, 102, 241, 0.1)",
                              color: isDarkMode ? "#a5b4fc" : "#4f46e5",
                              border: `1px solid ${isDarkMode ? "rgba(129, 140, 248, 0.3)" : "rgba(99, 102, 241, 0.2)"}`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Action Links */}
                    <Box sx={{ display: "flex", gap: 1.5, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                      {proj.gitRepoLink && (
                        <Button
                          href={proj.gitRepoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          size="small"
                          startIcon={<GitHub size={15} />}
                          sx={{
                            flex: 1,
                            textTransform: "none",
                            borderRadius: "8px",
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.primary,
                            "&:hover": {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          Code
                        </Button>
                      )}
                      {proj.projectLink && (
                        <Button
                          href={proj.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="contained"
                          size="small"
                          startIcon={<Launch size={15} />}
                          sx={{
                            flex: 1,
                            textTransform: "none",
                            borderRadius: "8px",
                          }}
                        >
                          Demo
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography color="text.secondary">No projects added yet.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Project;
