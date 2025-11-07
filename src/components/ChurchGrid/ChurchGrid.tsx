import { useEffect, useState } from "react";
import {
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Menu,
  MenuItem,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useFormik } from "formik";
import * as Yup from "yup";

import { CommonService } from "@service/common";
import { IBGEService } from "@service/ibge";
import { Toast } from "@core/Toast";
import { CommonDTO } from "@dtos/common/commonDTO";
import { IBGEState, IBGECity } from "@dtos/shared";
import { Button } from "@components/Button";

interface ChurchGridProps {
  isAuthorized: boolean;
}

export function ChurchGrid({ isAuthorized }: ChurchGridProps) {
  const [churches, setChurches] = useState<CommonDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChurch, setSelectedChurch] = useState<CommonDTO | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [commons, statesData] = await Promise.all([
        CommonService.findCommons(),
        IBGEService.getStates(),
      ]);
      setChurches(commons);
      setStates(statesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChurch?.state) {
      IBGEService.getCitiesByUF(selectedChurch.state).then(setCities);
    }
  }, [selectedChurch?.state]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    church: CommonDTO
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedChurch(church);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDeleteConfirmText("");
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmText !== selectedChurch?.name) return;

    await CommonService.deleteCommon(selectedChurch!.id);
    Toast.success("Congregação excluída!");
    setIsDeleteModalOpen(false);

    const commons = await CommonService.findCommons();
    setChurches(commons);
  };

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedChurch?.name || "",
      state: selectedChurch?.state || "",
      city: selectedChurch?.city || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nome é obrigatório"),
      state: Yup.string().required("Estado é obrigatório"),
      city: Yup.string().required("Cidade é obrigatória"),
    }),
    onSubmit: async (values) => {
      await CommonService.updateCommon(selectedChurch!.id, values);
      Toast.success("Congregação atualizada!");

      const commons = await CommonService.findCommons();
      setChurches(commons);
      setIsEditModalOpen(false);
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: "1200px", mt: 3 }}>
        <Grid container spacing={2}>
          {churches.map((church) => (
            <Grid key={church.id}>
              <Paper
                elevation={3}
                onClick={() => {
                  setSelectedChurch(church);
                  setIsViewModalOpen(true);
                }}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
                }}
              >
                {isAuthorized && (
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, church)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}

                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {church.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {church.city} - {church.state}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenEditModal} sx={{ color: "#1976d2" }}>
          <EditIcon sx={{ mr: 1, color: "#1976d2" }} /> Editar
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteModal} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} /> Excluir
        </MenuItem>
      </Menu>

      {/* VIEW MODAL */}
      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedChurch?.name}</DialogTitle>
        <DialogContent dividers>
          {selectedChurch && (
            <Stack spacing={2}>
              <Typography>
                <strong>Nome:</strong> {selectedChurch.name}
              </Typography>
              <Typography>
                <strong>Cidade:</strong> {selectedChurch.city}
              </Typography>
              <Typography>
                <strong>Estado:</strong> {selectedChurch.state}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => setIsViewModalOpen(false)}
            sx={{ color: "#1976d2", fontWeight: 600 }}
          >
            FECHAR
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Congregação</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField
              label="Nome"
              {...editFormik.getFieldProps("name")}
              error={editFormik.touched.name && Boolean(editFormik.errors.name)}
              helperText={editFormik.touched.name && editFormik.errors.name}
            />

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                value={editFormik.values.state}
                onChange={(e) => {
                  editFormik.setFieldValue("state", e.target.value);
                  editFormik.setFieldValue("city", "");
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

            <FormControl fullWidth disabled={!editFormik.values.state}>
              <InputLabel>Cidade</InputLabel>
              <Select label="Cidade" {...editFormik.getFieldProps("city")}>
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
          <MuiButton
            onClick={() => setIsEditModalOpen(false)}
            sx={{ color: "#d32f2f", fontWeight: 600 }}
          >
            CANCELAR
          </MuiButton>

          <Button
            onClick={editFormik.submitForm}
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45a049" },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Digite o nome da igreja <strong>{selectedChurch?.name}</strong> para
            confirmar:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => setIsDeleteModalOpen(false)}
            sx={{ color: "#d32f2f", fontWeight: 600 }}
          >
            CANCELAR
          </MuiButton>

          <MuiButton
            variant="contained"
            color="error"
            disabled={deleteConfirmText !== selectedChurch?.name}
            onClick={handleConfirmDelete}
          >
            Excluir
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
