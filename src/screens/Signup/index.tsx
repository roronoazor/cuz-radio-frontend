import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  MenuItem,
  Paper,
  Snackbar,
  Link,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { SIGNUP_URL } from "../../config/apiUrl";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface SignupData {
  username: string;
  email: string;
  userRole: string;
  password: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("PRIMARY");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async (userData: SignupData) => {
      const response = await axios.post(SIGNUP_URL, userData);
      return response.data;
    },
    onSuccess: (data) => {
      setSnackbarMessage("Signup successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Reset form fields
      setUsername("");
      setEmail("");
      setRole("PRIMARY");
      setPassword("");
      setConfirmPassword("");
      // Store user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data));
      // Update query cache
      queryClient.setQueryData(["user"], data);
      // Navigate to dashboard
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      let errorMessage = "An error occurred during login";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string | string[] }>;
        if (axiosError.response) {
          const responseMessage = axiosError.response.data?.message;
          if (Array.isArray(responseMessage)) {
            errorMessage = responseMessage.join(".");
          } else if (typeof responseMessage === "string") {
            errorMessage = responseMessage;
          }
        } else if (axiosError.request) {
          errorMessage = "No response received from the server";
        } else {
          errorMessage = axiosError.message || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }

    const userData: SignupData = {
      username,
      email,
      userRole: role,
      password,
    };

    signupMutation.mutate(userData);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="black"
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          style={{ padding: "36px", backgroundColor: "white" }}
        >
          <Box
            component="form"
            onSubmit={handleSignup}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              CuzRadio Signup
            </Typography>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Role"
              select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              margin="normal"
              fullWidth
              required
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="PRIMARY">PRIMARY</MenuItem>
              <MenuItem value="SECONDARY">SECONDARY</MenuItem>
            </TextField>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "16px" }}
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Signing up..." : "Signup"}
            </Button>
            <Box mt={2}>
              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" color="primary">
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
