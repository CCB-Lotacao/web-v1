import { Link, Typography } from "@mui/material";
import { JSX } from "react";

const Copyright: React.FC = (props): JSX.Element => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Copyright &copy;&nbsp;
      <Link
        color="inherit"
        href="https://github.com/orgs/CCB-Lotacao/repositories"
      >
        CCB Lotação
      </Link>
      &nbsp;{`${new Date().getFullYear()}.`}
    </Typography>
  );
};

export { Copyright };
