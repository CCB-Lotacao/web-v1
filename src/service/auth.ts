import { CreateUserDTO, UpdateUserDTO, UserDTO } from "@dtos/user";
import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  acessToken: string;
  user: UserDTO;
}

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<{
        user: LoginResponse["user"];
        acessToken: string;
      }>("/users/login", credentials);

      return {
        acessToken: response.data.acessToken,
        user: response.data.user,
      };
    } catch (error) {
      throw error;
    }
  },

  register: async (data: CreateUserDTO): Promise<UserDTO> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<UserDTO>("/users", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId: string, data: UpdateUserDTO): Promise<UserDTO> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = localStorage.getItem("acessToken");

      const response = await api.patch<UserDTO>(`/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
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

  getCurrentUser: (): UserDTO | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
