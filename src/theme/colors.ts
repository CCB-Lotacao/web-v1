import { yellow } from "@mui/material/colors";

import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CommonColors {
    grey: string;
  }

  interface Palette {
    mapboxMarker: string;
    rateFlowIntervalColors: string[];
    restrictedLocation: string;
    restrictedLocationBuffer: string;
    path_traveled: string;
    target_field: string;
    target_field_track: string;
    border_target_field: string;
    border_selected_target_field: string;
    applied: string;
    applied_overlap: string;
    external_applied: string;
    internal_applied: string;
    internal_applied_overlap: string;
    not_applied: string;
    lightBlue: string;
    light: string;
    restriction_field: string;
    restriction_field_buffer: string;
    applied_with_restriction_violation: string;
    applied_with_restriction_buffer_violation: string;
    applied_without_restriction_violation: string;
    path_traveled_with_warning: string;
    path_traveled_without_warning: string;
    cropped_not_applied: string;
  }
}

const defaultColors = {
  primary: {
    light: "#6ACA86",
    main: "#459667",
    dark: "#25674C",
  },
  secondary: {
    main: "#383C50",
  },
  common: {
    white: "#F8F4F1",
    grey: "#9E9E9E",
    black: "#212121",
  },
  error: {
    light: "#F88078",
    main: "#FF5252",
    dark: "#E31B0C",
  },
  info: {
    light: "#64B6F7",
    main: "#2196F3",
    dark: "#0B79D0",
  },
  success: {
    light: "#7BC67E",
    main: "#4CAF50",
    dark: "#3B873E",
  },
  warning: {
    light: "#FFB547",
    main: "#FB8C00",
    dark: "#C77700",
  },
  text: {
    primary: "#000000",
  },
  rateFlowIntervalColors: [
    "#001029",
    "#00317A",
    "#094DB3",
    "#1975FF",
    "#3385FF",
    "#FFB219",
    "#B37700",
    "#66470A",
    "#332405",
  ],
  mapboxMarker: "#FF0000",
  restrictedLocation: yellow[500],
  restrictedLocationBuffer: yellow[500],
  path_traveled: "#FFFFFF",
  target_field: "#F44336",
  target_field_track: "#961818",
  border_target_field: "#FF0000",
  border_selected_target_field: "#0000FF",
  applied: "#00C853",
  applied_overlap: "#FFC107",
  external_applied: "#FF9800",
  internal_applied: "#00BCD4",
  internal_applied_overlap: "#C51162",
  not_applied: "#FFFFFF",
  lightBlue: "#BBDEFB",
  light: "#FFFFFF",
  restriction_field: "#FDE047",
  restriction_field_buffer: "#FDE047",
  applied_with_restriction_violation: "#EF4444",
  applied_with_restriction_buffer_violation: "#BD0000",
  applied_without_restriction_violation: "#84CC16",
  path_traveled_with_warning: "#F97316",
  path_traveled_without_warning: "#000000",
  cropped_not_applied: "#9E9E9E",
};

export default defaultColors;
