import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthService } from "../../service";

import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Fade,
} from "@mui/material";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface LoginValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setLoading(true);

      try {
        const response = await AuthService.login(values);
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
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #dcebff 0%, #bcdcff 100%)",
        padding: 2,
      }}
    >
      {}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 8, textAlign: "center" }}>
          {" "}
          {}
          <img
            src="./public/ccb.png"
            alt="Logo Congregação Cristã no Brasil"
            style={{
              width: "300px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))",
            }}
          />
        </Box>
      </Fade>

      {}
      <Fade in timeout={1200}>
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 400,
            padding: 4,
            borderRadius: 4,
            backgroundColor: "#ffffffd9",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "#000000",
              textAlign: "center",
            }}
          >
            Login
          </Typography>

          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{
                mb: 2,
                backgroundColor: "#ffe5e5",
                padding: 1,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}

          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#f9fbff",
                  borderRadius: 2,
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#f9fbff",
                  borderRadius: 2,
                }}
              />

              <Link
                href="#"
                underline="hover"
                sx={{
                  textAlign: "right",
                  color: "#3b3b3b",
                  fontSize: "0.9rem",
                  mt: "-5px",
                }}
              >
                Esqueceu sua senha?
              </Link>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.3,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  background: "linear-gradient(145deg, #88bfff, #64a5ff)",
                  color: "#fff",
                  boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    background: "linear-gradient(145deg, #78afff, #559aff)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "ENTRAR"
                )}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="body2"
            sx={{ mt: 3, color: "#333", textAlign: "center" }}
          >
            Não possui uma conta?{" "}
            <Link
              href="#"
              underline="hover"
              sx={{
                fontWeight: "bold",
                color: "#4d7bff",
              }}
            >
              Cadastre-se!
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
