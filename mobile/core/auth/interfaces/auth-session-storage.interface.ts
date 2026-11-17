export interface AuthSessionStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  saveSession(accessToken: string, refreshToken?: string): Promise<void>;
  clearSession(): Promise<void>;
}
