import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ textAlign: "center", pt: 8 }}
    >
      <Box
        sx={{
          my: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          404 - Not Found
        </Typography>
        <Typography variant="subtitle1">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </Typography>
        <Box
          component="img"
          sx={{
            my: 4,
            maxWidth: "100%",
            height: "auto",
          }}
          alt="Page not found"
          src="/static/images/404.svg" // Replace with your own 404 image path
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
