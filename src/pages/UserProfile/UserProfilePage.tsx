import {
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { axiosErrorMessage } from "@utils/errorMessages";
import { Button } from "@components/Button";
import { SideBar } from "@components/SideBar";
import { UserDTO } from "@dtos/user";
import { ChurchService } from "@service/church";
import { ChurchDTO } from "@dtos/church";
import { Toast } from "@core/Toast";
import { IBGEService } from "@service/ibge";
import { IBGEState, IBGECity } from "@dtos/shared";
import { UserService } from "@service/user";

export default function UserProfilePage() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [churchOptions, setChurchOptions] = useState<ChurchDTO[]>([]);
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        const [churchs, statesData] = await Promise.all([
          ChurchService.findChurchs(),
          IBGEService.getStates(),
        ]);
        setChurchOptions(churchs);
        setStates(statesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);
  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().required("Nome é obrigatório"),
        email: Yup.string()
          .email("Email inválido")
          .required("Email é obrigatório"),
        phone: Yup.string().nullable(),
        churchId: Yup.string().nullable(),
        state: Yup.string().nullable(),
        city: Yup.string().nullable(),
      }),
    []
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      churchId: user?.church?.id || user?.churchId || "",
      state: user?.state || "",
      city: user?.city || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user) return;
      try {
        setLoading(true);
        const updated = await UserService.updateUser(user.id, values);
        setUser(updated);
        Toast.success("Dados atualizados com sucesso!");
      } catch (error) {
        axiosErrorMessage(
          error,
          intl.formatMessage({
            defaultMessage: "Erro ao atualizar dados.",
            id: "update.error.default",
          })
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.state) {
      IBGEService.getCitiesByUF(formik.values.state).then(setCities);
    }
  }, [formik.values.state]);

  if (!user) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            width: "1000px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Meu Perfil
          </Typography>

          <Divider />

          <form onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                required
                id="name"
                name="name"
                label="Nome completo"
                fullWidth
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

              <TextField
                required
                id="email"
                name="email"
                label="E-mail"
                fullWidth
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

              <TextField
                id="phone"
                name="phone"
                label="Celular"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />

              <FormControl fullWidth>
                <InputLabel id="church-select-label">
                  Comum Congregação
                </InputLabel>
                <Select
                  labelId="church-select-label"
                  id="churchId"
                  name="churchId"
                  value={formik.values.churchId}
                  label="Comum Congregação"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {churchOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="state-select-label">Estado</InputLabel>
                  <Select
                    labelId="state-select-label"
                    id="state"
                    name="state"
                    value={formik.values.state}
                    label="Estado"
                    onChange={(e) => {
                      formik.setFieldValue("state", e.target.value);
                      formik.setFieldValue("city", "");
                    }}
                    onBlur={formik.handleBlur}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.sigla} value={state.sigla}>
                        {state.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth disabled={!formik.values.state}>
                  <InputLabel id="city-select-label">Cidade</InputLabel>
                  <Select
                    labelId="city-select-label"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    label="Cidade"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.nome}>
                        {city.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                loading={loading}
                sx={{
                  alignSelf: "flex-end",
                  width: "220px",
                  py: 1.2,
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
                Editar
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
