import { SecureAuthSessionStorage } from "../storage/secure-auth-session.storage";
import type { AuthService } from "../interfaces/auth-service.interface";
import { InsForgeAuthService } from "./insforge-auth.service";
import { RestAuthService } from "./rest-auth.service";

type AuthProvider = "insforge" | "rest";

const authProvider = (process.env.EXPO_PUBLIC_AUTH_PROVIDER ??
  "insforge") as AuthProvider;

export const createAuthService = (): AuthService => {
  const sessionStorage = new SecureAuthSessionStorage();

  if (authProvider === "rest") {
    return new RestAuthService(sessionStorage);
  }

  return new InsForgeAuthService(sessionStorage);
};

export const authService = createAuthService();
