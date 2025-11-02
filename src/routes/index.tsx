import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthService } from "../service";
import ProtectedRoute from "../routes/ProtectedRoute";
import SignUp from "@pages/SignUp";
import SignIn from "@pages/SignIn/SignInPage";
import Home from "@pages/Home/HomePage";
import UserProfilePage from "@pages/UserProfile";
import ChurchPage from "@pages/Church/ChurchPage";
import { Loading } from "@components/Loading";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const authStatus = AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

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
        path="/cadastrar/veiculo WIP"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            children={undefined}
          ></ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
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
