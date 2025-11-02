import { Box, CircularProgress } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const pulseAnimation = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
`;

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(180deg, #dcebff 0%, #bcdcff 100%)",
  gap: 3,
});

const LogoImage = styled("img")({
  width: "300px",
  height: "300px",
  objectFit: "contain",
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
});

export const Loading = () => {
  return (
    <LoadingContainer>
      <LogoImage src="/images/ccb.png" alt="Logo" />
      <CircularProgress size={60} sx={{ color: "primary.main" }} />
    </LoadingContainer>
  );
};
