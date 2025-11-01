import {
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { SideBar } from "@components/SideBar";

export default function Home() {
  const [tab, setTab] = useState(0);

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
            width: "1000px",
            maxWidth: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            mt: 2,
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
