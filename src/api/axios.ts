import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
});

let basicAuthToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem("basicAuthToken") : null;

export const setBasicAuthCredentials = (username: string, password: string) => {
  basicAuthToken = window.btoa(`${username}:${password}`);
  localStorage.setItem("basicAuthToken", basicAuthToken);
};

export const clearBasicAuthCredentials = () => {
  basicAuthToken = null;
  localStorage.removeItem("basicAuthToken");
};

api.interceptors.request.use((config) => {
  if (basicAuthToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Basic ${basicAuthToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.Message ??
      error?.message ??
      "Beklenmeyen bir hata oluştu.";
    return Promise.reject(new Error(message));
  }
);
