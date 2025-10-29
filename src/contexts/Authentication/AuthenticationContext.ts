import {
  ConfirmResetPasswordInput,
  SignInInput,
} from "@contexts/Authentication/type";
import { createContext } from "react";

export interface AuthenticationContextProps {
  isLoading: boolean;
  isCurrentUserPilot: boolean;
  isCurrentUserAllowedToUpdateCustomer: boolean;
  isCurrentUserSystemAdmin: boolean;

  signIn: (params: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  resetPassword: (username: string) => Promise<void>;
  confirmResetPassword: (params: ConfirmResetPasswordInput) => Promise<void>;
  completeNewPassword: (newPassword: string) => Promise<void>;
}

const throwContextError = () => {
  throw new Error("useAuth must be used within an AuthenticationProvider");
};

const initialState: AuthenticationContextProps = {
  isLoading: true,
  isCurrentUserPilot: false,
  isCurrentUserAllowedToUpdateCustomer: false,
  isCurrentUserSystemAdmin: false,

  signIn: () => throwContextError(),
  signOut: () => throwContextError(),
  getCurrentUser: () => throwContextError(),
  resetPassword: () => throwContextError(),
  confirmResetPassword: () => throwContextError(),
  completeNewPassword: () => throwContextError(),
};

export const AuthenticationContext =
  createContext<AuthenticationContextProps>(initialState);
