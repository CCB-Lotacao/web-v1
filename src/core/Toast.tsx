import { closeSnackbar, enqueueSnackbar, SnackbarKey } from "notistack";

import { theme } from "@theme/index";

import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export class Toast {
  private static action = (snackbarId: SnackbarKey) => (
    <>
      <IconButton onClick={() => closeSnackbar(snackbarId)}>
        <CloseIcon sx={{ color: theme.palette.background.paper }} />
      </IconButton>
    </>
  );

  static error(msg: string) {
    enqueueSnackbar(msg, {
      variant: "error",
      preventDuplicate: true,
      style: {
        backgroundColor: theme.palette.error.main,
      },
      anchorOrigin: {
        horizontal: "right",
        vertical: "top",
      },
      action: this.action,
    });
  }

  static success(msg: string) {
    enqueueSnackbar(msg, {
      variant: "success",
      preventDuplicate: true,
      style: {
        backgroundColor: theme.palette.primary.main,
      },
      anchorOrigin: {
        horizontal: "right",
        vertical: "top",
      },
      action: this.action,
    });
  }

  static info(msg: string) {
    enqueueSnackbar(msg, {
      variant: "info",
      preventDuplicate: true,
      style: {
        backgroundColor: theme.palette.info.main,
      },
      anchorOrigin: { horizontal: "right", vertical: "top" },
      action: this.action,
    });
  }

  static warning(msg: string) {
    enqueueSnackbar(msg, {
      variant: "warning",
      preventDuplicate: true,
      style: {
        backgroundColor: theme.palette.warning.main,
      },
      anchorOrigin: {
        horizontal: "right",
        vertical: "top",
      },
      action: this.action,
    });
  }

  static custom(
    msg: string | React.ReactNode,
    options: {
      action?: (snackbarId: SnackbarKey) => React.ReactNode;
      persist?: boolean;
      autoHideDuration?: number | null;
      style?: React.CSSProperties;
    } = {}
  ): SnackbarKey {
    const {
      action,
      persist = false,
      autoHideDuration = 6000,
      style = { backgroundColor: theme.palette.info.main },
    } = options;

    return enqueueSnackbar(msg, {
      variant: "info",
      preventDuplicate: true,
      persist,
      autoHideDuration,
      style: {
        ...style,
      },
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
      action: action || this.action,
    });
  }
}
