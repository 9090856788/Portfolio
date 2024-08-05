import React from "react";
import { Grid, Box, Typography, IconButton } from "@mui/material";
import { Email, Phone, Facebook, Twitter, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <>
      <Box sx={{ width: "100%", height: "100%", p: 2 }}>
        <Grid container spacing={4}>
          {/* Social Media Links */}
          <Grid
            item
            xs={12}
            lg={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            gap={2}
          >
            <IconButton
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn />
            </IconButton>
          </Grid>

          {/* Email and Phone Number */}
          <Grid
            item
            xs={12}
            lg={6}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={4}
            gap={1}
          >
            <Typography
              variant="body1"
              color="textSecondary"
              textAlign="center"
            >
              <Email sx={{ mr: 1 }} /> kanhucharansahoo595@gmail.com
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              textAlign="center"
            >
              <Phone sx={{ mr: 1 }} /> +91 9090856788
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Footer;
