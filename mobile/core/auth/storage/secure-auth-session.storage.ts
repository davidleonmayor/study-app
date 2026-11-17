import { secureStorageService } from "@/core/storage/secure-store.storage";
import type { AuthSessionStorage } from "../interfaces/auth-session-storage.interface";

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh-token";

export class SecureAuthSessionStorage implements AuthSessionStorage {
  async getAccessToken(): Promise<string | null> {
    return secureStorageService.getItem(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return secureStorageService.getItem(REFRESH_TOKEN_KEY);
  }

  async saveSession(accessToken: string, refreshToken?: string): Promise<void> {
    await secureStorageService.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      await secureStorageService.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  async clearSession(): Promise<void> {
    await Promise.all([
      secureStorageService.deleteItem(ACCESS_TOKEN_KEY),
      secureStorageService.deleteItem(REFRESH_TOKEN_KEY),
      secureStorageService.deleteItem("email"),
    ]);
  }
}
