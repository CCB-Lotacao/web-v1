import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../service";
import ProtectedRoute from "../routes/ProtectedRoute";
import SignUp from "@pages/SignUp";
import SignIn from "@pages/SignIn/SignInPage";
import Home from "@pages/Home/HomePage";
import UserProfilePage from "@pages/UserProfile";
import ChurchPage from "@pages/Church/ChurchPage";
import RegisterChurchPage from "@pages/RegisterChurch";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isAuthenticated()
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
      />
      {}
      <Route path="/register" element={<SignUp />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register/church"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RegisterChurchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/church"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ChurchPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
