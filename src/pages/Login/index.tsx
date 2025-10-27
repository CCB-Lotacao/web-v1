import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../service";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validação de email
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return "Email é obrigatório";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email inválido";
    }
    return undefined;
  };

  // Validação de senha
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Senha é obrigatória";
    }
    if (password.length < 6) {
      return "Senha deve ter pelo menos 6 caracteres";
    }
    return undefined;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validação dos campos
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.login({ email, password });

      // Salvar token e usuário no localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
        code?: string;
      };

      // Verificar se é erro de servidor ou conexão
      if (
        error.message?.includes("Network Error") ||
        error.code === "ECONNREFUSED"
      ) {
        setError(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Erro ao fazer login. Verifique suas credenciais."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Login</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              onBlur={() =>
                setFieldErrors((prev) => ({
                  ...prev,
                  email: validateEmail(email),
                }))
              }
              style={{
                ...inputStyle,
                borderColor: fieldErrors.email ? "#dc3545" : "#e0e0e0",
              }}
              placeholder="seu@email.com"
            />
            {fieldErrors.email && (
              <span style={errorTextStyle}>{fieldErrors.email}</span>
            )}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                onBlur={() =>
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validatePassword(password),
                  }))
                }
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.password ? "#dc3545" : "#e0e0e0",
                  paddingRight: "40px",
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyle}
                tabIndex={-1}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {fieldErrors.password && (
              <span style={errorTextStyle}>{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
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
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "400px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#333",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  padding: "0.75rem",
  border: "2px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "1rem",
  transition: "all 0.3s",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem",
  backgroundColor: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s",
  marginTop: "0.5rem",
};

const errorStyle: React.CSSProperties = {
  backgroundColor: "#fee",
  color: "#c33",
  padding: "0.75rem",
  borderRadius: "8px",
  marginBottom: "1rem",
  textAlign: "center",
  fontSize: "0.9rem",
};

const errorTextStyle: React.CSSProperties = {
  color: "#dc3545",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
  display: "block",
};

const passwordContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
};

const eyeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.2rem",
  padding: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Login;
