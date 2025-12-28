import { create } from "zustand";
import { toast } from "react-toastify";
import { api, clearBasicAuthCredentials, setBasicAuthCredentials } from "../api/axios";

type AuthStatus = "idle" | "loading" | "authenticated" | "error";

const AUTH_TTL_MS = 30 * 60 * 1000;
const STORAGE_KEYS = {
  username: "authUsername",
  expiry: "authExpiry",
};
let logoutTimer: ReturnType<typeof setTimeout> | null = null;

const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};

const scheduleLogout = (expiresAt: number, logout: () => void) => {
  clearLogoutTimer();
  const delay = expiresAt - Date.now();
  if (delay <= 0) {
    logout();
    return;
  }
  logoutTimer = setTimeout(() => logout(), delay);
};

const readStoredSession = () => {
  if (typeof window === "undefined") {
    return { username: "", expiry: 0 };
  }
  const username = localStorage.getItem(STORAGE_KEYS.username) ?? "";
  const expiryRaw = localStorage.getItem(STORAGE_KEYS.expiry);
  const expiry = expiryRaw ? Number(expiryRaw) : 0;
  return { username, expiry };
};

type AuthState = {
  username: string;
  password: string;
  status: AuthStatus;
  error: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => {
  const { username, expiry } = readStoredSession();
  if (username && expiry && Date.now() < expiry) {
    scheduleLogout(expiry, () => get().logout());
  } else if (typeof window !== "undefined") {
    clearBasicAuthCredentials();
    localStorage.removeItem(STORAGE_KEYS.username);
    localStorage.removeItem(STORAGE_KEYS.expiry);
  }

  return {
    username: username && Date.now() < expiry ? username : "",
    password: "",
    status: username && Date.now() < expiry ? "authenticated" : "idle",
    error: "",
    login: async (loginUsername, password) => {
      set({ status: "loading", error: "" });
      try {
        await api.get("/api/assets", {
          auth: { username: loginUsername, password },
        });
        const expiresAt = Date.now() + AUTH_TTL_MS;
        setBasicAuthCredentials(loginUsername, password);
        localStorage.setItem(STORAGE_KEYS.username, loginUsername);
        localStorage.setItem(STORAGE_KEYS.expiry, String(expiresAt));
        scheduleLogout(expiresAt, () => get().logout());
        set({
          username: loginUsername,
          password,
          status: "authenticated",
          error: "",
        });
        toast.success("Giriş başarılı.");
      } catch (requestError) {
        clearBasicAuthCredentials();
        localStorage.removeItem(STORAGE_KEYS.username);
        localStorage.removeItem(STORAGE_KEYS.expiry);
        set({
          username: "",
          password: "",
          status: "error",
          error:
            requestError instanceof Error
              ? requestError.message
              : "Giriş başarısız. Kullanıcı adı veya şifre hatalı.",
        });
        toast.error(
          requestError instanceof Error
            ? requestError.message
            : "Giriş başarısız. Kullanıcı adı veya şifre hatalı."
        );
        throw requestError;
      }
    },
    logout: () => {
      clearLogoutTimer();
      clearBasicAuthCredentials();
      localStorage.removeItem(STORAGE_KEYS.username);
      localStorage.removeItem(STORAGE_KEYS.expiry);
      set({ username: "", password: "", status: "idle", error: "" });
      toast.info("Çıkış yapıldı.");
    },
  };
});
