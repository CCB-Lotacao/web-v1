import { ReactNode } from "react";
import { Box, Grid, Fade } from "@mui/material";
import { styled } from "@mui/material/styles";
import { theme } from "@theme/index";
import Copyright from "../Copyright";

export interface AuthCardProps {
  children: ReactNode;
  logoSrc?: string;
}

export const AuthCard = ({
  children,
  logoSrc = "/images/ccb.png",
}: AuthCardProps) => {
  return (
    <BackgroundGrid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Fade in timeout={800}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Logo
            src={logoSrc}
            alt="Logo Congregação Cristã no Brasil"
            sx={{
              width: "280px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))",
            }}
          />
        </Box>
      </Fade>

      {children}

      <Box sx={{ mt: 6 }}>
        <Copyright />
      </Box>
    </BackgroundGrid>
  );
};

const BackgroundGrid = styled(Grid)`
  min-height: 100dvh;
  height: auto;
  width: 100%;
  background: linear-gradient(180deg, #dcebff 0%, #bcdcff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(2)};
  overflow-y: auto;
`;

const Logo = styled("img")``;
