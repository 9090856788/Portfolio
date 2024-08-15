import React from "react";
import {
  Box,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box>
        {/* Phone & Email Section */}
        <Box
          sx={{
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            padding: 2,
            borderRadius: "8px",
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 16px ${theme.palette.grey[900]}, 
                       -8px -8px 16px ${theme.palette.grey[800]}`
                : `8px 8px 16px ${theme.palette.grey[300]}, 
                       -8px -8px 16px ${theme.palette.grey[100]}`,
          }}
        >
          {/* Email Section */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "320px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              padding: 2,
              borderRadius: "8px",
              boxShadow:
                theme.palette.mode === "dark"
                  ? `8px 8px 16px ${theme.palette.grey[900]}, 
                       -8px -8px 16px ${theme.palette.grey[800]}`
                  : `8px 8px 16px ${theme.palette.grey[300]}, 
                       -8px -8px 16px ${theme.palette.grey[100]}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <EmailIcon />
              <Typography variant="h6">Email:</Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ marginLeft: isMobile ? 0 : 3, wordWrap: "break-word" }}
            >
              kanhucharansahoo595@gmail.com
            </Typography>
          </Box>

          {/* Phone Section */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "320px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              padding: 2,
              borderRadius: "8px",
              boxShadow:
                theme.palette.mode === "dark"
                  ? `8px 8px 16px ${theme.palette.grey[900]}, 
                       -8px -8px 16px ${theme.palette.grey[800]}`
                  : `8px 8px 16px ${theme.palette.grey[300]}, 
                       -8px -8px 16px ${theme.palette.grey[100]}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <PhoneIcon />
              <Typography variant="h6">Phone:</Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ marginLeft: isMobile ? 0 : 3, wordWrap: "break-word" }}
            >
              +91 9090856788
            </Typography>
          </Box>
        </Box>

        {/* Contact Form */}
        <Box
          sx={{
            marginTop: 2,
            border: "1px solid transparent",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            padding: 5,
            borderRadius: "8px",
            boxShadow:
              theme.palette.mode === "dark"
                ? `8px 8px 16px ${theme.palette.grey[900]}, 
                       -8px -8px 16px ${theme.palette.grey[800]}`
                : `8px 8px 16px ${theme.palette.grey[300]}, 
                       -8px -8px 16px ${theme.palette.grey[100]}`,
          }}
        >
          <Typography>
            I am always excited to explore new projects, opportunities, and
            freelance ventures in the tech world. If you have a project or idea
            you'd like to discuss, or if you're seeking a collaborator with a
            passion for technology, feel free to reach out. Let's connect and
            create something amazing together!
          </Typography>
          <Box>
            <TextField
              label="Name"
              variant="standard"
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
              }}
            />{" "}
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              sx={{
                margin: "20px 0px 20px 0px",
                "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
              }}
            />
            <TextField
              label="Message"
              variant="standard"
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                },
              }}
            />{" "}
          </Box>
          <Button
            variant="contained"
            sx={{
              marginTop: 2,
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderRadius: "50px",
              border: "none",
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
              fontSize: isMobile ? "0.75rem" : "1rem",
              padding: isMobile ? "6px 12px" : "10px 20px",
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ContactForm;
