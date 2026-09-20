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
import { useParams } from "react-router-dom";
import { fetchSkills, fetchTimeline, fetchSoftware } from "../api/portfolioApi";
import SubHeading from "./SubHeading";

/**
 * ResumeForm component.
 * Displays structured Education, Experience, Technical Skills, and Tools.
 */
const ResumeForm = () => {
  const theme = useTheme();
  const { username } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills", username],
    queryFn: () => fetchSkills(username),
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ["timeline", username],
    queryFn: () => fetchTimeline(username),
  });

  const { data: software } = useQuery({
    queryKey: ["software", username],
    queryFn: () => fetchSoftware(username),
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

  const cardShadow = isDarkMode
    ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
    : `6px 6px 14px ${theme.palette.grey[300]}, -6px -6px 14px ${theme.palette.grey[100]}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        color: theme.palette.text.primary,
      }}
    >
      {/* Education & Experience Columns */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        {/* Education Section */}
        <Grid item xs={12} sm={6}>
          <SubHeading title="Education" sx={{ mt: 1, mb: 2 }} />
          {timelineLoading ? (
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          ) : (
            displayedEducation.map((item) => (
              <Card
                key={item._id}
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  boxShadow: cardShadow,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "0.98rem" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDarkMode ? "#a5b4fc" : "#4f46e5", mt: 0.3 }}>
                    {item.company} ({item.period || `${item.timeline?.from || ""} - ${item.timeline?.to || ""}`})
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.8, lineHeight: 1.5 }}>
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
          <SubHeading title="Experience" sx={{ mt: 1, mb: 2 }} />
          {timelineLoading ? (
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          ) : (
            displayedExperience.map((item) => (
              <Card
                key={item._id}
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  boxShadow: cardShadow,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "0.98rem" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDarkMode ? "#a5b4fc" : "#4f46e5", mt: 0.3 }}>
                    {item.company} ({item.period || `${item.timeline?.from || ""} - ${item.timeline?.to || ""}`})
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.8, lineHeight: 1.5 }}>
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
        <SubHeading title="Technical Proficiency" sx={{ mt: 2, mb: 2 }} />
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
                  p: 1.8,
                  borderRadius: "12px",
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: cardShadow,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {skill.svg?.url && (
                      <img src={skill.svg.url} alt="" style={{ width: 20, height: 20 }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {skill.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
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
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: isDarkMode ? "#818cf8" : "#4f46e5",
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Software Applications & Tools */}
      <Box sx={{ width: "100%", mb: 1 }}>
        <SubHeading title="Tools & Technologies" sx={{ mt: 2, mb: 2 }} />
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
                borderRadius: "8px",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDarkMode
                  ? `4px 4px 10px ${theme.palette.grey[900]}, -4px -4px 10px ${theme.palette.grey[800]}`
                  : `4px 4px 10px ${theme.palette.grey[300]}, -4px -4px 10px ${theme.palette.grey[100]}`,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "8px 14px",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(ResumeForm);
