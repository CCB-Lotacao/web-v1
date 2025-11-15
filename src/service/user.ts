import { CreateUserDTO, UpdateUserDTO, UserDTO } from "@dtos/user";
import api from "./api";

export const UserService = {
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

  getCurrentUser: (): UserDTO | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
