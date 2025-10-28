import { createTheme } from "@mui/material/styles";

import defaultColors from "./colors";
import defaultTypography from "./typography";

const theme = createTheme({
  palette: defaultColors,
  typography: defaultTypography,
  spacing: 16,
  components: {
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: defaultColors.error.main,
        },
      },
    },
  },
});

export { theme };
