import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthService } from "../service";
import ProtectedRoute from "../routes/ProtectedRoute";
import SignUp from "@pages/SignUp";
import SignIn from "@pages/SignIn/SignInPage";
import Home from "@pages/Home/HomePage";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = AuthService.isAuthenticated();
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loadingSpinnerStyle}>Carregando...</div>
      </div>
    );
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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

const loadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const loadingSpinnerStyle: React.CSSProperties = {
  color: "white",
  fontSize: "1.2rem",
  fontWeight: "600",
};

export default AppRoutes;
