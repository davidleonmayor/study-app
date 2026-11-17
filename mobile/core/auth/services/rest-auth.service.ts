import { moneyUpApi } from "@/core/api";
import type {
  AuthRegistrationResult,
  AuthUser,
  AuthService,
} from "../interfaces/auth-service.interface";
import type { AuthSessionStorage } from "../interfaces/auth-session-storage.interface";

type RestUser = {
  id?: string;
  email: string;
  name?: string;
};

export class RestAuthService implements AuthService {
  constructor(private readonly sessionStorage: AuthSessionStorage) {}

  async register(
    email: string,
    name: string,
    password: string,
  ): Promise<AuthRegistrationResult> {
    await moneyUpApi.post("/auth/create-account", {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password,
    });

    return {
      user: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
      },
      requiresEmailVerification: true,
    };
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const { data: token } = await moneyUpApi.post<string>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    await this.sessionStorage.saveSession(token);
    return { email: email.trim().toLowerCase() };
  }

  async verifyEmail(email: string, otp: string): Promise<AuthUser> {
    await moneyUpApi.post("/auth/confirm-account", { token: otp });

    return {
      email: email.trim().toLowerCase(),
      emailVerified: true,
    };
  }

  async restoreSession(): Promise<AuthUser | null> {
    const token = await this.sessionStorage.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const { data } = await moneyUpApi.get<RestUser>("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        id: data.id,
        email: data.email,
        name: data.name,
      };
    } catch {
      await this.sessionStorage.clearSession();
      return null;
    }
  }

  async logout(): Promise<void> {
    await this.sessionStorage.clearSession();
  }

  getAccessToken(): Promise<string | null> {
    return this.sessionStorage.getAccessToken();
  }
}
