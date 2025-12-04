import { useEffect, useState, useRef } from "react";
import {
  Paper,
  CircularProgress,
  Box,
  IconButton,
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
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ChurchService } from "@service/church";
import { IBGEService } from "@service/ibge";
import { Toast } from "@core/Toast";
import { ChurchDTO } from "@dtos/church/churchDTO";
import { IBGEState, IBGECity } from "@dtos/shared";
import { Button } from "@components/Button";
import { axiosErrorMessage } from "@utils/errorMessages";

interface ChurchGridProps {
  isAuthorized: boolean;
  search: string;
  refreshTrigger?: number;
}

export function ChurchGrid({
  isAuthorized,
  search,
  refreshTrigger,
}: ChurchGridProps) {
  const [churches, setChurches] = useState<ChurchDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChurch, setSelectedChurch] = useState<ChurchDTO | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const isLoadingRef = useRef(false);
  const previousRefreshTriggerRef = useRef<number | undefined>(undefined);

  const loadData = async () => {
    if (isLoadingRef.current) {
      return;
    }
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const [churchs, statesData] = await Promise.all([
        ChurchService.findChurchs(),
        IBGEService.getStates(),
      ]);
      setChurches(churchs);
      setStates(statesData);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (refreshTrigger === undefined) {
      return;
    }
    if (previousRefreshTriggerRef.current === undefined) {
      previousRefreshTriggerRef.current = refreshTrigger;
      return;
    }
    if (refreshTrigger !== previousRefreshTriggerRef.current) {
      previousRefreshTriggerRef.current = refreshTrigger;
      loadData();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedChurch?.state) {
      IBGEService.getCitiesByUF(selectedChurch.state).then(setCities);
    }
  }, [selectedChurch?.state]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    church: ChurchDTO
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

    await ChurchService.deleteChurch(selectedChurch!.id);
    Toast.success("Congregação excluída!");
    setIsDeleteModalOpen(false);

    const churchs = await ChurchService.findChurchs();
    setChurches(churchs);
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
    }),
    onSubmit: async (values) => {
      try {
        await ChurchService.updateChurch(selectedChurch!.id, values);
        Toast.success("Congregação atualizada!");

        const churchs = await ChurchService.findChurchs();
        setChurches(churchs);
        setIsEditModalOpen(false);
      } catch (error) {
        axiosErrorMessage(error, "Erro ao atualizar congregação");
      }
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredChurches = churches.filter((church) =>
    church.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredChurches.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChurches = filteredChurches.slice(startIndex, endIndex);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Box sx={{ width: "1200px", mt: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {paginatedChurches.map((church) => (
            <Paper
              key={church.id}
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
                width: "100%",
                minHeight: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
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

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  pr: isAuthorized ? 5 : 0,
                }}
              >
                {church.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {church.city} - {church.state}
              </Typography>
            </Paper>
          ))}
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
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
        <DialogTitle>
          <strong>{selectedChurch?.name}</strong>
        </DialogTitle>
        <DialogContent dividers>
          {selectedChurch && (
            <Stack spacing={1}>
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

      {}
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

      {}
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
            confirmar a exclusão
          </Typography>
          <TextField
            fullWidth
            required
            label="Digite o nome para confirmar"
            placeholder={selectedChurch?.name}
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            sx={{
              backgroundColor: "#f9fbff",
              borderRadius: 2,
              "& .MuiFormLabel-asterisk": { color: "red" },
            }}
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
