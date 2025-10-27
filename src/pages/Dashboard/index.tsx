import { AuthService } from "../../service";

const Dashboard = () => {
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Dashboard</h1>

        <div style={contentStyle}>
          <p style={textStyle}>
            Bem-vindo, <strong>{user?.name || user?.email}</strong>!
          </p>
          <p style={textStyle}>Esta é uma tela vazia para fins de teste.</p>
          <p style={textStyle}>
            Você está conectado ao backend em localhost:3000
          </p>
        </div>

        <button onClick={handleLogout} style={buttonStyle}>
          Sair
        </button>
      </div>
    </div>
  );
};

// Estilos
const containerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "3rem",
  borderRadius: "12px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "600px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#333",
};

const contentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "2rem",
};

const textStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#555",
  textAlign: "center",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s",
};

export default Dashboard;
