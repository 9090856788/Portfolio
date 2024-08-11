import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const InfoCard = () => {
  // Dummy data
  const data = {
    icon: <InfoIcon fontSize="large" />,
    heading: "Information",
    description: "This is a brief description of the information provided in this section.",
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "20px",
        boxShadow: "7px 7px 15px #bebebe, -7px -7px 15px #ffffff",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "inset 7px 7px 15px #bebebe, inset -7px -7px 15px #ffffff",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ marginRight: "10px", color: "primary.main" }}>
            {data.icon}
          </Box>
          <Typography variant="h5" component="div">
            {data.heading}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
