import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginScreen from "./screens/Login";
import SignUpScreen from "./screens/Signup";
import DashboardScreen from "./screens/DashboardScreen";
import MainLayout from "./layouts/MainLayout";
import Error404 from "./screens/Error404";
import Admin from "./screens/Admin";
import Primary from "./screens/Primary";
import Secondary from "./screens/Secondary";

// Create a client
const queryClient = new QueryClient();

interface AuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<AuthProps> = ({ children }) => {
  const location = useLocation();
  const storedData = JSON.parse(sessionStorage.getItem("user") || "{}");

  if (!storedData.access_token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const RedirectIfLoggedIn: React.FC<AuthProps> = ({ children }) => {
  const storedData = JSON.parse(sessionStorage.getItem("user") || "{}");

  if (storedData.access_token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardScreen />} />
            <Route path="admin_routes" element={<Admin />} />
            <Route path="primary_routes" element={<Primary />} />
            <Route path="secondary_routes" element={<Secondary />} />
            <Route path="not-found" element={<Error404 />} />
          </Route>
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <LoginScreen />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <SignUpScreen />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
