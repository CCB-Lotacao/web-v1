import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthService, CommonService } from "../../service";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { axiosErrorMessage } from "@utils/errorMessages";
import { AuthCard } from "../../components/AuthCard";
import { Button } from "@components/Button";
import { CommonDTO } from "@dtos/common";

interface SignUpValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  commonId?: string;
}

const SignUpPage = () => {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comumOptions, setComumOptions] = useState<CommonDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComumOptions = async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const options = await CommonService.findCommons();
        setComumOptions(options);
      } catch (error) {
        throw error;
      }
    };

    fetchComumOptions();
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().required(
          intl.formatMessage({
            defaultMessage: "Nome é obrigatório",
            id: "signUp.name.required",
          })
        ),
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
        confirmPassword: Yup.string()
          .oneOf(
            [Yup.ref("password")],
            intl.formatMessage({
              defaultMessage: "As senhas devem ser iguais",
              id: "signUp.confirmPassword.match",
            })
          )
          .required(
            intl.formatMessage({
              defaultMessage: "Confirmar senha é obrigatória",
              id: "signUp.confirmPassword.required",
            })
          ),
      }),
    [intl]
  );

  const formik = useFormik<SignUpValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      commonId: "",
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { ...data } = values;
        await AuthService.register(data);
        navigate("/login");
      } catch (error) {
        axiosErrorMessage(
          error,
          intl.formatMessage({
            defaultMessage: "Erro ao criar conta. Tente novamente.",
            id: "signUp.error.default",
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
            Cadastre-se
          </Typography>

          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              {}
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                label="Nome Completo"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{
                  backgroundColor: "#f9fbff",
                  borderRadius: 2,
                  "& .MuiFormLabel-asterisk": { color: "red" },
                }}
              />
              <FormControl
                fullWidth
                sx={{ backgroundColor: "#f9fbff", borderRadius: 2 }}
              >
                <InputLabel id="common-select-label">
                  Comum Congregação
                </InputLabel>
                <Select
                  labelId="common-select-label"
                  id="commonId"
                  name="commonId"
                  value={formik.values.commonId}
                  label="Comum Congregação"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {}
                  {comumOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {}
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
                  "& .MuiFormLabel-asterisk": { color: "red" },
                }}
              />

              {}
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#f9fbff",
                  borderRadius: 2,
                  "& .MuiFormLabel-asterisk": { color: "red" },
                }}
              />

              {}
              <TextField
                required
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Senha"
                type={showConfirmPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#f9fbff",
                  borderRadius: 2,
                  "& .MuiFormLabel-asterisk": { color: "red" },
                }}
              />

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
                  "CADASTRAR"
                )}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="body2"
            sx={{ mt: 3, color: "#333", textAlign: "center" }}
          >
            Já possui uma conta?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{
                fontWeight: "bold",
                color: "#4d7bff",
              }}
            >
              Entre!
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </AuthCard>
  );
};

export default SignUpPage;
