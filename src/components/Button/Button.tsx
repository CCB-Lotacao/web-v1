import { theme } from "@theme/index";

import { Button as MUIButton, ButtonProps } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { css, styled } from "@mui/material/styles";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button = ({
  children,
  loading = false,
  disabled,
  ...props
}: CustomButtonProps) => (
  <ButtonWrapper {...props} disabled={disabled || loading} disableElevation>
    {loading && (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: theme.spacing(0.5),
        }}
      >
        <CircularProgress size={13} color="inherit" />
      </span>
    )}
    {children}
  </ButtonWrapper>
);

const ButtonWrapper = styled(MUIButton)`
  font-size: ${(props) => props.theme.typography.body1};
  font-weight: 500;
  text-transform: none;
  ${(props) =>
    props.variant === "contained" &&
    css`
      background-color: ${props.theme.palette.primary["main"]};
      color: ${props.theme.palette.common["white"]};
      &:hover {
        background-color: ${props.theme.palette.primary["dark"]};
      }
    `};
`;
