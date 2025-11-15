import {
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { SideBar } from "@components/SideBar";
import { UserDTO } from "@dtos/user";
import { UserRole } from "axios/types/axios";
import { UserService } from "@service/user";

export default function Home() {
  const [tab, setTab] = useState(0);
  const [user] = useState<UserDTO | null>(() => UserService.getCurrentUser());

  const isAuthorized =
    user?.role === UserRole.ASSISTANT || user?.role === UserRole.SYSTEM_ADMIN;

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
          {}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Lotações"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
          </Tabs>

          {}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Pesquisar"
              variant="filled"
              size="small"
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
                  "&:hover": {
                    backgroundColor: "grey.200",
                  },
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
              >
                Criar Lotação
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
