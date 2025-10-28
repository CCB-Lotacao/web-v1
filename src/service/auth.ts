import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const acessToken = localStorage.getItem("acessToken");
  if (acessToken) {
    config.headers.Authorization = `Bearer ${acessToken}`;
  }
  return config;
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  acessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    state?: string;
    city?: string;
  };
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

  logout: () => {
    localStorage.removeItem("acessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("acessToken");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default api;
