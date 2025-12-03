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
import { ChurchService } from "@service/church";
import { Toast } from "@core/Toast";
import { IBGEService } from "@service/ibge";
import { IBGEState, IBGECity } from "@dtos/shared";

export default function RegisterChurchPage() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesData = await IBGEService.getStates();
        setStates(statesData);
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().required("Nome é obrigatório"),
        state: Yup.string().nullable(),
        city: Yup.string().nullable(),
      }),
    []
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      state: "",
      city: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await ChurchService.createChurch(values);
        Toast.success("Igreja cadastrada com sucesso!");
        formik.resetForm();
        setCities([]);
      } catch (error) {
        axiosErrorMessage(
          error,
          intl.formatMessage({
            defaultMessage: "Erro ao cadastrar igreja.",
            id: "register.church.error.default",
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
    } else {
      setCities([]);
    }
  }, [formik.values.state]);

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
            Cadastrar Igreja
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
                Cadastrar
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
