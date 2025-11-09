import axios from "axios";
import { AuthService } from ".";

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        AuthService.logout();
        return Promise.reject(error);
      }

      const refreshResponse = await api.post(
        "/users/refresh",
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      localStorage.setItem("acessToken", refreshResponse.data.acessToken);

      error.config.headers.Authorization = `Bearer ${refreshResponse.data.acessToken}`;
      return api(error.config);
    } catch {
      AuthService.logout();
      return Promise.reject(error);
    }
  }
);

export default api;
