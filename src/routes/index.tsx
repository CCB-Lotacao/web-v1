import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { AuthService } from "../service";
import ProtectedRoute from "../routes/ProtectedRoute";

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
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Estilos
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
