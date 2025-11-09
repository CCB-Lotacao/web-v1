import {
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { SideBar } from "@components/SideBar";
import { UserDTO } from "@dtos/user";
import { AuthService } from "@service/auth";
import { UserRole } from "axios/types/axios";
import { ChurchGrid } from "@components/ChurchGrid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IBGEService } from "@service/ibge";
import { CommonService } from "@service/common";
import { Toast } from "@core/Toast";
import { Button as CustomButton } from "@components/Button";
import { IBGEState, IBGECity } from "@dtos/shared";
import { axiosErrorMessage } from "@utils/errorMessages";

export default function ChurchPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [user] = useState<UserDTO | null>(() => AuthService.getCurrentUser());

  const isAuthorized =
    user?.role === UserRole.ASSISTANT || user?.role === UserRole.SYSTEM_ADMIN;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);

  useEffect(() => {
    IBGEService.getStates().then(setStates);
  }, []);

  const createFormik = useFormik({
    initialValues: {
      name: "",
      state: "",
      city: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nome é obrigatório"),
    }),
    onSubmit: async (values) => {
      try {
        await CommonService.createCommon(values);
        Toast.success("Congregação cadastrada com sucesso!");
        setIsCreateModalOpen(false);
      } catch (error) {
        axiosErrorMessage(error, "Erro ao cadastrar congregação");
      }
    },
  });

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
            p: 1.75,
            borderRadius: 2,
            width: "1200px",
            maxWidth: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            mt: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Igrejas"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
          </Tabs>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Pesquisar Igreja"
              variant="filled"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "grey.100",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "grey.200" },
                  paddingTop: "8.5px",
                  paddingBottom: "8.5px",
                  paddingLeft: "1px",
                },
                "& .MuiFilledInput-input": {
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: "8px",
                },
                alignSelf: "center",
              }}
            />

            {isAuthorized && (
              <Button
                variant="contained"
                color="success"
                disableElevation
                sx={{ ml: 2 }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Cadastrar
              </Button>
            )}
          </Box>
        </Paper>

        <ChurchGrid isAuthorized={isAuthorized} search={search} />
      </Box>

      {}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cadastrar Nova Congregação</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField
              label="Nome"
              {...createFormik.getFieldProps("name")}
              error={
                createFormik.touched.name && Boolean(createFormik.errors.name)
              }
              helperText={createFormik.touched.name && createFormik.errors.name}
            />

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                value={createFormik.values.state}
                onChange={(e) => {
                  createFormik.setFieldValue("state", e.target.value);
                  createFormik.setFieldValue("city", "");
                  IBGEService.getCitiesByUF(e.target.value).then(setCities);
                }}
              >
                {states.map((s) => (
                  <MenuItem key={s.sigla} value={s.sigla}>
                    {s.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!createFormik.values.state}>
              <InputLabel>Cidade</InputLabel>
              <Select label="Cidade" {...createFormik.getFieldProps("city")}>
                {cities.map((c) => (
                  <MenuItem key={c.id} value={c.nome}>
                    {c.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsCreateModalOpen(false)} color="error">
            Cancelar
          </Button>

          <CustomButton
            onClick={createFormik.submitForm}
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45a049" },
            }}
          >
            Salvar
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
