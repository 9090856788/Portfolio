/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
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
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../api/portfolioApi";

const ContactForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDarkMode = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    senderName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [feedback, setFeedback] = useState(null);

  const mutation = useMutation({
    mutationFn: sendContactMessage,
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
      subject: formData.subject || `Inquiry from ${formData.senderName} (${formData.email || "No email"})`,
      message: formData.message,
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Phone & Email Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 2,
          padding: 2,
          borderRadius: "12px",
          boxShadow: isDarkMode
            ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
          transition: "all 0.3s ease",
          mb: 3,
        }}
      >
        {/* Email Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 2,
            borderRadius: "10px",
            bgcolor: theme.palette.background.paper,
            boxShadow: isDarkMode
              ? `inset 2px 2px 5px ${theme.palette.grey[900]}, inset -2px -2px 5px ${theme.palette.grey[800]}`
              : `inset 2px 2px 5px ${theme.palette.grey[300]}, inset -2px -2px 5px ${theme.palette.grey[100]}`,
          }}
        >
          <EmailIcon sx={{ color: "#ef4444", fontSize: 32 }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700 }}>
              Email Me
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-all" }}>
              kanhucharansahoo595@gmail.com
            </Typography>
          </Box>
        </Box>

        {/* Phone Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 2,
            borderRadius: "10px",
            bgcolor: theme.palette.background.paper,
            boxShadow: isDarkMode
              ? `inset 2px 2px 5px ${theme.palette.grey[900]}, inset -2px -2px 5px ${theme.palette.grey[800]}`
              : `inset 2px 2px 5px ${theme.palette.grey[300]}, inset -2px -2px 5px ${theme.palette.grey[100]}`,
          }}
        >
          <PhoneIcon sx={{ color: "#3b82f6", fontSize: 32 }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700 }}>
              Direct Line
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              +91 9090856788
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Card */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 3,
          borderRadius: "12px",
          bgcolor: theme.palette.background.paper,
          boxShadow: isDarkMode
            ? `8px 8px 16px ${theme.palette.grey[900]}, -8px -8px 16px ${theme.palette.grey[800]}`
            : `8px 8px 16px ${theme.palette.grey[300]}, -8px -8px 16px ${theme.palette.grey[100]}`,
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          I am always excited to explore new projects, opportunities, and freelance ventures. Send me a message and let's create something exceptional together!
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

        <Button
          id="btn-send-contact-message"
          type="submit"
          variant="contained"
          disabled={mutation.isPending}
          startIcon={mutation.isPending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          sx={{
            alignSelf: "flex-start",
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: "50px",
            px: 4,
            py: 1.2,
            boxShadow: isDarkMode
              ? `8px 8px 15px ${theme.palette.grey[900]}, -8px -8px 15px ${theme.palette.grey[800]}`
              : `8px 8px 15px ${theme.palette.grey[300]}, -8px -8px 15px ${theme.palette.grey[100]}`,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: isDarkMode ? "#272a38" : "#e5e7eb",
              transform: "translateY(-2px)",
            },
          }}
        >
          {mutation.isPending ? "Sending..." : "Send Message"}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactForm;
