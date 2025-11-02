// [Arquivo: ChurchGrid.tsx]

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
  Button,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CommonService } from "@service/common";
import { CommonDTO } from "@dtos/common/commonDTO";

interface ChurchGridProps {
  isAuthorized: boolean;
}

export function ChurchGrid({ isAuthorized }: ChurchGridProps) {
  const [churches, setChurches] = useState<CommonDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<CommonDTO | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    const fetchChurches = async () => {
      try {
        setIsLoading(true);
        const data = await CommonService.findCommons();
        setChurches(data);
        setError(null);
      } catch (err) {
        console.error("Falha ao buscar igrejas:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChurches();
  }, []);

  const handleOpenViewModal = (church: CommonDTO) => {
    setSelectedChurch(church);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedChurch(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    church: CommonDTO
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedChurch(church);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedChurch(null);
  };

  const handleSaveChanges = () => {
    console.log("SALVAR EDIÇÃO:", selectedChurch?.id);
    handleCloseEditModal();
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDeleteConfirmText("");
    handleMenuClose();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedChurch(null);
    setDeleteConfirmText("");
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText === selectedChurch?.name) {
      console.log("EXCLUIR (CONFIRMADO):", selectedChurch?.id);
      handleCloseDeleteModal();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, mt: 3, color: "error.main", width: "1200px" }}>
        {error}
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ width: "1200px", maxWidth: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          {churches.map((church) => (
            <Grid key={church.id}>
              <Paper
                elevation={3}
                onClick={() => handleOpenViewModal(church)}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 6,
                  },
                }}
              >
                {}
                {isAuthorized && (
                  <IconButton
                    aria-label="opções"
                    onClick={(e) => handleMenuOpen(e, church)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}

                <Box sx={{ pr: isAuthorized ? 4 : 0 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 600 }}
                  >
                    {church.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {church.city} - {church.state}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {}
      <Dialog
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {selectedChurch?.name}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <strong>Cidade:</strong> {selectedChurch?.city}
          </Typography>
          <Typography gutterBottom>
            <strong>Estado:</strong> {selectedChurch?.state}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenEditModal} sx={{ color: "primary.main" }}>
          <EditIcon sx={{ mr: 1.5, color: "primary.main" }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteModal} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1.5 }} fontSize="small" />
          Excluir
        </MenuItem>
      </Menu>

      {}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar: {selectedChurch?.name}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nome"
            defaultValue={selectedChurch?.name}
            fullWidth
            margin="normal"
            variant="filled"
          />
          <TextField
            label="Cidade"
            defaultValue={selectedChurch?.city}
            fullWidth
            margin="normal"
            variant="filled"
          />
          <TextField
            label="Estado"
            defaultValue={selectedChurch?.state}
            fullWidth
            margin="normal"
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Digite o nome da igreja <strong>{selectedChurch?.name}</strong> Para
            confirmar a exclusão permanente:
            <br />
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Digite o nome para confirmar"
            type="text"
            fullWidth
            variant="outlined"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteConfirmText !== selectedChurch?.name}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
