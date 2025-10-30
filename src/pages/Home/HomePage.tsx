import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
          color: "black",
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            CCB Lotação
          </Typography>
          <IconButton>
            <Avatar sx={{ bgcolor: "#ff0000" }}>CCB</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 1.75,
            borderRadius: 2,
            width: { xs: "100%", sm: "1000px" },
            maxWidth: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
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
            <Tab
              label="Igrejas"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
          </Tabs>

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
        </Paper>
      </Box>
    </Box>
  );
}
