import { mockApiHandler } from "./mockApi";
import { getStoredLocale, translate, translateApiError } from "@/i18n/translations";

export interface ApiErrorItem {
  code: string;
  message: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  errors?: ApiErrorItem[];
  timestamp?: string;
  path?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: ApiErrorItem[] = []
  ) {
    super(message);
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) throw new Error("VITE_API_BASE_URL is required");
const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === "true";

/* ---- JWT access/refresh token lives in memory; session cookie maintains web login via reload. ---- */

let accessToken: string | null = null;
let refreshToken: string | null = null;
let csrfTokenFromApi: string | null = null;

export function setAuthToken(token: string | null) {
  accessToken = token;
}

export function getAuthToken(): string | null {
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

function getCsrfToken(): string | null {
  if (csrfTokenFromApi) return csrfTokenFromApi;
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("XSRF-TOKEN="));
  return cookie ? decodeURIComponent(cookie.slice("XSRF-TOKEN=".length)) : null;
}

/** Calling when refreshing the token is also no longer available — authStore registers to clear user/login navigation. */
let authFailureHandler: (() => void) | null = null;
export function setAuthFailureHandler(handler: (() => void) | null) {
  authFailureHandler = handler;
}

/* Auth's own endpoint — 401 here is a real failure (wrong password/expired refresh),*/
/* It's not "access token expires mid-session" so don't try to refresh (avoid loop).*/
const NO_REFRESH_PATHS = new Set(["/api/auth/login", "/api/auth/signup", "/api/auth/refresh"]);

let refreshPromise: Promise<boolean> | null = null;

function isApiEnvelope<T = unknown>(body: unknown): body is ApiEnvelope<T> {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    "code" in body &&
    "message" in body &&
    ("data" in body || "errors" in body)
  );
}

function unwrapApiBody<T>(body: unknown): T {
  if (isApiEnvelope<T>(body)) {
    return body.data as T;
  }
  return body as T;
}

function parseApiErrors(body: unknown, fallbackMessage: string): { message: string; errors: ApiErrorItem[] } {
  if (isApiEnvelope(body)) {
    const errors = Array.isArray(body.errors) ? body.errors : [];
    return { message: body.message || errors[0]?.message || fallbackMessage, errors };
  }
  const errors = Array.isArray(body) ? (body as ApiErrorItem[]) : [];
  return { message: errors[0]?.message ?? fallbackMessage, errors };
}

/** Dedup: multiple 401 requests at the same time only call /api/auth/refresh once, sharing the results. */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) return false;
        const data = unwrapApiBody<{ accessToken: string; refreshToken: string }>(await response.json());
        setAuthToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, isRetry = false): Promise<T> {
  const headers = new Headers(init.headers);
  /* FormData sets its own multipart boundary — Content-Type cannot be overridden*/
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  /* JWT: sent with every request if any — backend receives Bearer OR session cookie*/
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const csrfToken = getCsrfToken();
  if (csrfToken && !headers.has("X-XSRF-TOKEN")) {
    headers.set("X-XSRF-TOKEN", csrfToken);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (USE_MOCK_API) {
      console.warn(`[API] Backend unreachable for ${init.method || "GET"} ${path}. Using mock data...`);
      const mockData = await mockApiHandler(path, init);
      if (mockData !== undefined) return mockData as T;
    }
    throw error;
  }

  // Mock fallback is opt-in so backend/API regressions are visible during normal dev.
  if (!response.ok && USE_MOCK_API) {
    const mockData = await mockApiHandler(path, init);
    if (mockData !== undefined) {
      console.warn(`[API] ${response.status} - using mock for ${init.method || "GET"} ${path}`);
      return mockData as T;
    }
  }

  /* Access token expires mid-session (60 minutes) — try refreshing once and then retry the original request*/
  if (response.status === 401 && !isRetry && !NO_REFRESH_PATHS.has(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, init, true);
    }
    setAuthToken(null);
    setRefreshToken(null);
    if (!USE_MOCK_API) {
      authFailureHandler?.();
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  /* Proxy/gateway may return non-JSON body (HTML error page) — do not throw SyntaxError*/
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const { message, errors } = parseApiErrors(body, response.statusText ?? "Request failed");
    throw new ApiError(message, response.status, errors);
  }

  const data = unwrapApiBody<T>(body);
  if (path === "/api/auth/csrf" && typeof data === "string") {
    csrfTokenFromApi = data;
  }
  return data;
}

export function getApiErrorMessage(error: unknown, fallback = "An error occurred"): string {
  const locale = getStoredLocale();
  if (error instanceof ApiError) return translateApiError(error.errors[0]?.code, locale, error.message);
  return locale === "vi" ? fallback : translate("common.error", locale);
}
