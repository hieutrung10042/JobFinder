import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API,
});

// Auto attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});