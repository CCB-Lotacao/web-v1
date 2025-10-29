import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthService } from "../../service";
import { useIntl } from "react-intl";
import {
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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { axiosErrorMessage } from "@utils/errorMessages";
import { AuthCard } from "../../components/AuthCard";
import { Button } from "@components/Button";

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface SignInValues {
  email: string;
  password: string;
}

const SignIn = ({ setIsAuthenticated }: SignInProps) => {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string()
          .email(
            intl.formatMessage({
              defaultMessage: "Email inválido",
              id: "vjEwEd",
            })
          )
          .required(
            intl.formatMessage({
              defaultMessage: "Este campo é obrigatório",
              id: "eKbI8/",
            })
          ),
        password: Yup.string().required(
          intl.formatMessage({
            defaultMessage: "Senha é obrigatória",
            id: "4/Gj1G",
          })
        ),
      }),
    [intl]
  );

  const formik = useFormik<SignInValues>({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await AuthService.login(values);
        localStorage.setItem("acessToken", response.acessToken);
        localStorage.setItem("user", JSON.stringify(response.user));
        setIsAuthenticated(true);
        navigate("/dashboard");
      } catch (error) {
        axiosErrorMessage(
          error,
          intl.formatMessage({
            defaultMessage: "Erro ao fazer login. Verifique suas credenciais.",
            id: "login.error.default",
          })
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <AuthCard>
      <Fade in timeout={1000}>
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

          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  backgroundColor: "#f9fbff",
                  borderRadius: 2,
                }}
              />

              <TextField
                required
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
    </AuthCard>
  );
};

export default SignIn;
