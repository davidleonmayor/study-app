import { insforge } from "@/core/api/insforge";
import type {
  AuthRegistrationResult,
  AuthUser,
  AuthService,
} from "../interfaces/auth-service.interface";
import type { AuthSessionStorage } from "../interfaces/auth-session-storage.interface";

type InsForgeUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  profile?: { name?: string } | null;
};

type AuthResponse = {
  user?: InsForgeUser;
  accessToken: string | null;
  refreshToken?: string;
};

const toAuthUser = (user: InsForgeUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.profile?.name,
  emailVerified: user.emailVerified,
});

export class InsForgeAuthService implements AuthService {
  constructor(private readonly sessionStorage: AuthSessionStorage) {}

  async register(
    email: string,
    name: string,
    password: string,
  ): Promise<AuthRegistrationResult> {
    const { data, error } = await insforge.auth.signUp({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password,
    });

    if (error || !data) {
      throw new Error(error?.message ?? "No se pudo crear la cuenta.");
    }

    if (data.accessToken) {
      await this.sessionStorage.saveSession(
        data.accessToken,
        data.refreshToken,
      );
    }

    return {
      user: data.user ? toAuthUser(data.user) : undefined,
      requiresEmailVerification: data.requireEmailVerification ?? false,
    };
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await insforge.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data?.accessToken || !data.user) {
      throw new Error(error?.message ?? "No se pudo iniciar sesión.");
    }

    await this.sessionStorage.saveSession(data.accessToken, data.refreshToken);

    return toAuthUser(data.user);
  }

  async verifyEmail(email: string, otp: string): Promise<AuthUser> {
    const { data, error } = await insforge.auth.verifyEmail({
      email: email.trim().toLowerCase(),
      otp,
    });

    if (error || !data?.accessToken || !data.user) {
      throw new Error(error?.message ?? "No se pudo verificar el correo.");
    }

    await this.sessionStorage.saveSession(data.accessToken, data.refreshToken);

    return toAuthUser(data.user);
  }

  async restoreSession(): Promise<AuthUser | null> {
    const refreshToken = await this.sessionStorage.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const { data, error } = await insforge.auth.refreshSession({
      refreshToken,
    });
    const session = data as AuthResponse | null;

    if (error || !session?.accessToken || !session.user) {
      await this.sessionStorage.clearSession();
      return null;
    }

    await this.sessionStorage.saveSession(
      session.accessToken,
      session.refreshToken ?? refreshToken,
    );

    return toAuthUser(session.user);
  }

  async logout(): Promise<void> {
    const { error } = await insforge.auth.signOut();

    await this.sessionStorage.clearSession();

    if (error) {
      throw new Error(error.message);
    }
  }

  getAccessToken(): Promise<string | null> {
    return this.sessionStorage.getAccessToken();
  }
}
