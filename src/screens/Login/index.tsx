import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
  Snackbar,
  Link,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { LOGIN_URL } from "../../config/apiUrl";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface LoginData {
  email: string;
  password: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (userData: LoginData) => {
      const response = await axios.post(LOGIN_URL, userData);
      return response.data;
    },
    onSuccess: (data) => {
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Store user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data));
      // Update query cache
      queryClient.setQueryData(["user"], data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Navigate to dashboard
      navigate("/");
    },
    onError: (error: unknown) => {
      let errorMessage = "An error occurred during login";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string | string[] }>;
        if (axiosError.response) {
          const responseMessage = axiosError.response.data?.message;
          if (Array.isArray(responseMessage)) {
            errorMessage = responseMessage.join(". ");
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

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setSnackbarMessage("Please enter both email and password");
      setSnackbarOpen(true);
      return;
    }

    loginMutation.mutate({ email, password });
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
            onSubmit={handleLogin}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              CuzRadio Login
            </Typography>
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
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <Box mt={2}>
              <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/signup" color="primary">
                  Sign up here
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

export default Login;
