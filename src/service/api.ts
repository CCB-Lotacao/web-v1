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

export default api;
