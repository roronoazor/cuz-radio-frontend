import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to CuzRadio Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" paragraph>
        You are currently logged in as an Admin user. This grants you full
        access to all features and route sets in the application.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              About CuzRadio
            </Typography>
            <Typography variant="body1" paragraph>
              CuzRadio is a sophisticated application with tiered access levels.
              It provides different functionalities based on user roles,
              ensuring secure and appropriate access to various features.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Roles and Access Levels
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Admin"
                    secondary="Full access to all route sets: Primary, Secondary, and Admin"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Primary User"
                    secondary="Access to Primary routes only"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Secondary User"
                    secondary="Access to Secondary routes only"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Route Sets Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Primary Routes
                    </Typography>
                    <Typography variant="body2">
                      Core functionalities accessible to all users.
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <LockOpenIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Accessible to you</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" color="secondary" gutterBottom>
                      Secondary Routes
                    </Typography>
                    <Typography variant="body2">
                      Advanced features for secondary and admin users.
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <LockOpenIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Accessible to you</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" color="error" gutterBottom>
                      Admin Routes
                    </Typography>
                    <Typography variant="body2">
                      Exclusive features for system administration.
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <LockOpenIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2">Accessible to you</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
