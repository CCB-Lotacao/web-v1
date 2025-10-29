import { AuthenticationContext } from "@contexts/Authentication/AuthenticationContext";
import { useContext } from "react";

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider"
    );
  }

  return context;
};
