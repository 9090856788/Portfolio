import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { sendContactMessage, fetchUserProfile } from "../api/portfolioApi";

/**
 * ContactForm component.
 * Features neumorphic contact badges, clean inputs, and tactile submit button.
 */
const ContactForm = () => {
  const theme = useTheme();
  const { username } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const { data: user } = useQuery({
    queryKey: ["portfolioUser", username],
    queryFn: () => fetchUserProfile(username),
  });

  const userEmail = user?.email?.trim() || "";
  const userPhone = user?.phone?.trim() || "";
  const hasBadges = Boolean(userEmail || userPhone);

  const [formData, setFormData] = useState({
    senderName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [feedback, setFeedback] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => sendContactMessage(data, username),
    onSuccess: () => {
      setFeedback({
        type: "success",
        text: "Thank you! Your message has been delivered successfully.",
      });
      setFormData({ senderName: "", email: "", subject: "", message: "" });
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        text: err.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.senderName || !formData.message) {
      setFeedback({ type: "error", text: "Please provide your name and message." });
      return;
    }
    mutation.mutate({
      senderName: formData.senderName,
      senderEmail: formData.email,
      email: formData.email,
      subject: formData.subject || `Inquiry from ${formData.senderName} (${formData.email || "No email"})`,
      message: formData.message,
    });
  };

  const cardShadow = isDarkMode
    ? `6px 6px 14px ${theme.palette.grey[900]}, -6px -6px 14px ${theme.palette.grey[800]}`
    : `6px 6px 14px ${theme.palette.grey[300]}, -6px -6px 14px ${theme.palette.grey[100]}`;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Phone & Email Section - only show if configured in admin */}
      {hasBadges && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: userEmail && userPhone && !isMobile ? "1fr 1fr" : "1fr",
            gap: 2,
            padding: 2,
            borderRadius: "14px",
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDarkMode
              ? `inset 3px 3px 8px ${theme.palette.grey[900]}, inset -3px -3px 8px ${theme.palette.grey[800]}`
              : `inset 3px 3px 8px ${theme.palette.grey[300]}, inset -3px -3px 8px ${theme.palette.grey[100]}`,
            mb: 3,
          }}
        >
          {/* Email Quick Badge */}
          {userEmail && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                borderRadius: "12px",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: cardShadow,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <EmailIcon sx={{ color: "#ef4444", fontSize: 24 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary", letterSpacing: "0.04em", display: "block", mb: 0.2 }}>
                  Email Address
                </Typography>
                <Typography
                  component="a"
                  href={`mailto:${userEmail}`}
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    textDecoration: "none",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    lineHeight: 1.35,
                    display: "block",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: isDarkMode ? "#a5b4fc" : "#4f46e5",
                    },
                  }}
                >
                  {userEmail}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Phone Quick Badge */}
          {userPhone && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                borderRadius: "12px",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: cardShadow,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <PhoneIcon sx={{ color: "#3b82f6", fontSize: 24 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary", letterSpacing: "0.04em" }}>
                  Direct Contact
                </Typography>
                <Typography
                  component="a"
                  href={`tel:${userPhone}`}
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    textDecoration: "none",
                    lineHeight: 1.35,
                    display: "block",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: isDarkMode ? "#a5b4fc" : "#4f46e5",
                    },
                  }}
                >
                  {userPhone}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Form Card */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.2,
          padding: { xs: 2, sm: 3 },
          borderRadius: "14px",
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: cardShadow,
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: "0.93rem" }}>
          I am always open to discussing new opportunities, frontend architectural projects, and creative collaborations. Feel free to leave a note below!
        </Typography>

        {feedback && (
          <Alert
            severity={feedback.type}
            onClose={() => setFeedback(null)}
            sx={{ borderRadius: "8px" }}
          >
            {feedback.text}
          </Alert>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 2 }}>
          <TextField
            label="Your Name *"
            variant="outlined"
            size="small"
            required
            value={formData.senderName}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
          />
          <TextField
            label="Your Email"
            variant="outlined"
            size="small"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Box>

        <TextField
          label="Subject"
          variant="outlined"
          size="small"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />

        <TextField
          label="Message *"
          variant="outlined"
          multiline
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />

        {/* Neumorphic Submit Button */}
        <Button
          id="btn-send-contact-message"
          type="submit"
          variant="text"
          disabled={mutation.isPending}
          startIcon={mutation.isPending ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
          sx={{
            alignSelf: "flex-start",
            bgcolor: theme.palette.background.paper,
            color: isDarkMode ? "#a5b4fc" : "#4f46e5",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            px: 3.5,
            py: 1.2,
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
          {mutation.isPending ? "Sending..." : "Send Message"}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(ContactForm);
