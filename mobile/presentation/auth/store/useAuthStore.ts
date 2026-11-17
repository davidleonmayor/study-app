import { authService, secureStorage } from "@/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  token?: string;
  email?: string;
  name?: string;
  user?: {
    id?: string;
    email: string;
    name?: string;
  };
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

type StoreType = AuthState & AuthActions;

export const useAuthStore = create<StoreType>()(
  persist(
    (set, get) => ({
      user: undefined,
      token: undefined,
      status: "checking",

      login: async (email: string, password: string) => {
        const user = await authService.login(email, password);
        const token = await authService.getAccessToken();

        set({
          email: user.email,
          name: user.name,
          token: token ?? undefined,
          user,
          status: "authenticated",
        });
      },

      verifyEmail: async (email: string, otp: string) => {
        const user = await authService.verifyEmail(email, otp);
        const token = await authService.getAccessToken();

        set({
          email: user.email,
          name: user.name,
          token: token ?? undefined,
          user,
          status: token ? "authenticated" : "unauthenticated",
        });
      },

      logout: async () => {
        await authService.logout();
        set({
          email: undefined,
          name: undefined,
          token: undefined,
          user: undefined,
          status: "unauthenticated",
        });
      },

      checkAuth: async () => {
        const user = await authService.restoreSession();
        const token = await authService.getAccessToken();

        if (!user || !token) {
          set({
            email: undefined,
            name: undefined,
            token: undefined,
            user: undefined,
            status: "unauthenticated",
          });
          return;
        }

        set({
          email: user.email,
          name: user.name,
          token,
          user,
          status: "authenticated",
        });
      },
    }),
    {
      name: "auth-storage",
      storage: secureStorage,
      partialize: (state) => ({
        token: state.token,
        email: state.email,
        name: state.name,
        status: state.status,
      }),
    },
  ),
);
