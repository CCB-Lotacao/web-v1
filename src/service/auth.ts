import { UserDTO } from "@dtos/user";
import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  acessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<{
        user: LoginResponse["user"];
        acessToken: string;
        refreshToken: string;
      }>("/auth/login", credentials);

      localStorage.setItem("acessToken", response.data.acessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return {
        acessToken: response.data.acessToken,
        user: response.data.user,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("acessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("acessToken");
  },
};
