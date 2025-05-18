import { create } from "zustand";
import * as authApi from "../api/authApi";
import { User } from "../types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.loginUser(credentials);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Login failed", isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.registerUser(data);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Register failed", isLoading: false });
    }
  },

  logout: () => {
    sessionStorage.removeItem("access_token");
    set({ user: null });
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.fetchCurrentUser();
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ user: null, isLoading: false });
    }
  },
}));
