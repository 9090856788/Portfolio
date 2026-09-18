/* eslint-disable no-unused-vars */
import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills, fetchTimeline, fetchSoftware } from "../api/portfolioApi";

const ResumeForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: fetchTimeline,
  });

  const { data: software } = useQuery({
    queryKey: ["software"],
    queryFn: fetchSoftware,
  });

  // Separate education and experience
  const educationList = timeline?.filter(
    (t) =>
      t.title?.toLowerCase().includes("bachelor") ||
      t.title?.toLowerCase().includes("degree") ||
      t.title?.toLowerCase().includes("school") ||
      t.title?.toLowerCase().includes("education") ||
      t.company?.toLowerCase().includes("university") ||
      t.company?.toLowerCase().includes("school")
  ) || [];

  const experienceList = timeline?.filter(
    (t) => !educationList.some((e) => e._id === t._id)
  ) || [];

  // Fallback defaults if list is empty
  const displayedEducation =
    educationList.length > 0
      ? educationList
      : [
          {
            _id: "edu-1",
            title: "Bachelor of Technology",
            company: "Biju Patnaik University of Technology",
            period: "2019 - 2023",
            description: "Computer Science and Web Application Engineering.",
          },
        ];

  const displayedExperience =
    experienceList.length > 0
      ? experienceList
      : [
          {
            _id: "exp-1",
            title: "Frontend Developer",
            company: "Tech Solutions",
            period: "2023 - Present",
            description: "Building modern scalable web apps using React, Next.js, and Express.",
          },
        ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "10px",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Education & Experience Section */}
      <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
        {/* Education Section */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            🎓 Education
          </Typography>
          {timelineLoading ? (
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          ) : (
            displayedEducation.map((item) => (
              <Card
                key={item._id}
                sx={{
                  marginBottom: "12px",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "12px",
                  boxShadow: isDarkMode
                    ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
                    : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isDarkMode
                      ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                      : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {item.company} ({item.period || `${item.timeline?.from || ""} - ${item.timeline?.to || ""}`})
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                      {item.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>

        {/* Experience Section */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            💼 Experience
          </Typography>
          {timelineLoading ? (
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          ) : (
            displayedExperience.map((item) => (
              <Card
                key={item._id}
                sx={{
                  marginBottom: "12px",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "12px",
                  boxShadow: isDarkMode
                    ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
                    : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isDarkMode
                      ? `12px 12px 24px ${theme.palette.grey[900]}, -12px -12px 24px ${theme.palette.grey[800]}`
                      : `12px 12px 24px ${theme.palette.grey[300]}, -12px -12px 24px ${theme.palette.grey[100]}`,
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {item.company} ({item.period || `${item.timeline?.from || ""} - ${item.timeline?.to || ""}`})
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                      {item.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      {/* Technical Skills with Proficiency */}
      <Box sx={{ mb: 3, width: "100%" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⚡ Technical Proficiency
        </Typography>
        {skillsLoading ? (
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 2,
            }}
          >
            {(skills || []).map((skill) => (
              <Box
                key={skill._id}
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {skill.svg?.url && (
                      <img src={skill.svg.url} alt="" style={{ width: 18, height: 18 }} />
                    )}
                    <Typography variant="body2" fontWeight={600}>
                      {skill.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {skill.proficiency}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Number(skill.proficiency) || 75}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Software Applications & Tools */}
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🛠️ Tools & Technologies
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
          {((software && software.length > 0) ? software.map((s) => s.name) : [
            "VS Code",
            "Postman",
            "GitHub",
            "Figma",
            "Chrome DevTools",
            "Vite",
            "Docker",
          ]).map((tool) => (
            <Chip
              key={tool}
              label={tool}
              sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: "7px",
                boxShadow: isDarkMode
                  ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
                  : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
                fontSize: "0.85rem",
                padding: "8px 14px",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ResumeForm;
