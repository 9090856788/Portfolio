/* eslint-disable no-unused-vars */
import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ResumeForn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        maxWidth: "auto",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Education & Experience Section */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          marginBottom: "20px",
        }}
      >
        {/* Education Section */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🎓 Education
          </Typography>
          <Card
            sx={{
              marginBottom: "10px",
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `12px 12px 24px ${theme.palette.grey[900]}, 
                       -12px -12px 24px ${theme.palette.grey[800]}`
                    : `12px 12px 24px ${theme.palette.grey[300]}, 
                       -12px -12px 24px ${theme.palette.grey[100]}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Software Development
              </Typography>
              <Typography variant="body2">
                Moringa School (2020-2021)
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `12px 12px 24px ${theme.palette.grey[900]}, 
                       -12px -12px 24px ${theme.palette.grey[800]}`
                    : `12px 12px 24px ${theme.palette.grey[300]}, 
                       -12px -12px 24px ${theme.palette.grey[100]}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Disaster Management
              </Typography>
              <Typography variant="body2">
                Masinde Muliro University (2012-2016)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Experience Section */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            💼 Experience
          </Typography>
          <Card
            sx={{
              marginBottom: "10px",
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `12px 12px 24px ${theme.palette.grey[900]}, 
                       -12px -12px 24px ${theme.palette.grey[800]}`
                    : `12px 12px 24px ${theme.palette.grey[300]}, 
                       -12px -12px 24px ${theme.palette.grey[100]}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Technical Mentor
              </Typography>
              <Typography variant="body2">
                Moringa School (2022 - Present)
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `12px 12px 24px ${theme.palette.grey[900]}, 
                       -12px -12px 24px ${theme.palette.grey[800]}`
                    : `12px 12px 24px ${theme.palette.grey[300]}, 
                       -12px -12px 24px ${theme.palette.grey[100]}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Website Development
              </Typography>
              <Typography variant="body2">
                Village 2 Nation (2021-2022)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Work Skills & Soft Skills Section */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Work Skills */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Work Skills
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {[
              "NEXT.js",
              "React.js",
              "HTML 5",
              "CSS 3",
              "Tailwind CSS",
              "Figma",
              "JavaScript",
              "Mongo DB",
              "SQL",
              "Angular",
              "Android",
              "Git",
            ].map((skill) => (
              <Chip
                key={skill}
                label={skill}
                sx={{
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  borderRadius: "7px",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
                      : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
                  transition:
                    "box-shadow 0.3s ease, transform 0.3s ease, background-color 0.3s ease",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? `inset 8px 8px 15px ${theme.palette.grey[900]}, inset -8px -8px 15px ${theme.palette.grey[800]}`
                        : `inset 8px 8px 15px ${theme.palette.grey[300]}, inset -8px -8px 15px ${theme.palette.grey[100]}`,
                    transform: "translateY(-2px)",
                  },
                  fontSize: isMobile
                    ? "0.75rem"
                    : isTablet
                    ? "0.85rem"
                    : "1rem",
                  padding: isMobile
                    ? "6px 12px"
                    : isTablet
                    ? "8px 16px"
                    : "10px 20px",
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Soft Skills */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Soft Skills
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {[
              "Time Management",
              "Mentorship",
              "Impeccable Communication",
              "Flexibility",
              "Research",
              "Writing",
            ].map((skill) => (
              <Chip
                key={skill}
                label={skill}
                sx={{
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  borderRadius: "7px",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
                      : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
                  transition:
                    "box-shadow 0.3s ease, transform 0.3s ease, background-color 0.3s ease",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? `inset 8px 8px 15px ${theme.palette.grey[900]}, inset -8px -8px 15px ${theme.palette.grey[800]}`
                        : `inset 8px 8px 15px ${theme.palette.grey[300]}, inset -8px -8px 15px ${theme.palette.grey[100]}`,
                    transform: "translateY(-2px)",
                  },
                  fontSize: isMobile
                    ? "0.75rem"
                    : isTablet
                    ? "0.85rem"
                    : "1rem",
                  padding: isMobile
                    ? "6px 12px"
                    : isTablet
                    ? "8px 16px"
                    : "10px 20px",
                }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeForn;
