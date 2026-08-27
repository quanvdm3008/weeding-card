import { create } from "zustand";
import {
  apiRequest,
  getApiErrorMessage,
  getRefreshToken,
  setAuthFailureHandler,
  setAuthToken,
  setRefreshToken,
} from "@/lib/api";

export interface StudioUser {
  userId: string;
  externalSubject?: string | null;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  emailVerified: boolean;
}

/** Login/signup/refresh response: user, JWT access token, refresh token, and session cookie. */
interface AuthResponse {
  user: StudioUser;
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
}

interface AuthState {
  user: StudioUser | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string, accountType?: "OWNER" | "PROVIDER") => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ error: string | null }>;
  verifyEmail: (token: string) => Promise<{ error: string | null }>;
  resendVerificationEmail: () => Promise<{ error: string | null }>;
}

const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === "true";

/** Mock user for DEV offline when VITE_USE_MOCK_API=true is enabled. */
const DEV_MOCK_USER: StudioUser | null = USE_MOCK_API
  ? {
      userId: "u-1",
      email: "admin@weddinginvitation.com",
      displayName: "Admin",
      roles: ["OWNER", "Admin"],
      permissions: [],
      emailVerified: true,
    }
  : null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEV_MOCK_USER,
  loading: false,
  initialized: USE_MOCK_API,

  init: async () => {
    if (USE_MOCK_API) {
      set({ user: DEV_MOCK_USER, loading: false, initialized: true });
      return;
    }
    set({ loading: true });
    try {
      const user = await apiRequest<StudioUser>("/api/auth/me");
      // A full reload restores the session cookie but not the in-memory JWT. Materialize the
      // XSRF cookie before any session-authenticated POST/PUT/DELETE request is attempted.
      await apiRequest<string>("/api/auth/csrf");
      set({ user, loading: false, initialized: true });
    } catch {
      set({ user: null, loading: false, initialized: true });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      await apiRequest<string>("/api/auth/csrf");
      const response = await apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      set({ user: response.user, loading: false, initialized: true });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: getApiErrorMessage(error, "Login failed") };
    }
  },

  signUp: async (email, password, displayName, accountType = "OWNER") => {
    set({ loading: true });
    try {
      await apiRequest<string>("/api/auth/csrf");
      const response = await apiRequest<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, displayName, accountType }),
      });
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      set({ user: response.user, loading: false, initialized: true });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: getApiErrorMessage(error, "Account creation failed") };
    }
  },

  signOut: async () => {
    const refreshToken = getRefreshToken();
    await apiRequest<string>("/api/auth/csrf").catch(() => undefined);
    await apiRequest<void>("/api/auth/logout", {
      method: "POST",
      body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
    }).catch(() => undefined);
    setAuthToken(null);
    setRefreshToken(null);
    set({ user: null });
  },

  forgotPassword: async (email) => {
    try {
      await apiRequest<void>("/api/auth/password/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return { error: null };
    } catch (error) {
      return { error: getApiErrorMessage(error, "Unable to submit request, please try again") };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      await apiRequest<void>("/api/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      return { error: null };
    } catch (error) {
      return { error: getApiErrorMessage(error, "Unable to reset password") };
    }
  },

  verifyEmail: async (token) => {
    try {
      await apiRequest<void>("/api/auth/email/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      const current = get().user;
      if (current) set({ user: { ...current, emailVerified: true } });
      return { error: null };
    } catch (error) {
      return { error: getApiErrorMessage(error, "Unable to verify email") };
    }
  },

  resendVerificationEmail: async () => {
    try {
      await apiRequest<void>("/api/auth/email/resend", { method: "POST" });
      return { error: null };
    } catch (error) {
      return { error: getApiErrorMessage(error, "Unable to resend the verification email") };
    }
  },
}));

/* Refresh token also expires/revoke mid-session → clear user, ProtectedRoute navigates /login.*/
setAuthFailureHandler(() => {
  useAuthStore.setState({ user: null, initialized: true });
});
