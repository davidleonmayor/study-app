export interface AuthUser {
  id?: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
}

export interface AuthRegistrationResult {
  user?: AuthUser;
  requiresEmailVerification: boolean;
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthUser>;
  register(
    email: string,
    name: string,
    password: string,
  ): Promise<AuthRegistrationResult>;
  verifyEmail(email: string, otp: string): Promise<AuthUser>;
  restoreSession(): Promise<AuthUser | null>;
  logout(): Promise<void>;
  getAccessToken(): Promise<string | null>;
}
