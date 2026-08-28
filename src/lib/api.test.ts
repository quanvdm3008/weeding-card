// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, setAuthToken, setRefreshToken } from "./api";

describe("apiRequest security headers", () => {
  afterEach(() => {
    setAuthToken(null);
    setRefreshToken(null);
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("keeps bearer tokens out of persistent browser storage", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { ok: true } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);
    setAuthToken("memory-only-token");

    await apiRequest("/api/test");

    expect(localStorage.length).toBe(0);
    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get("Authorization")).toBe("Bearer memory-only-token");
  });

  it("copies the CSRF cookie into Spring Security's request header", async () => {
    document.cookie = "XSRF-TOKEN=csrf%20token; path=/";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { ok: true } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/api/test", { method: "POST", body: "{}" });

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get("X-XSRF-TOKEN")).toBe("csrf token");
  });

  it("uses the CSRF token returned by the API for cross-origin requests", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, code: 200, message: "OK", data: "api-csrf-token" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/api/auth/csrf");
    await apiRequest("/api/auth/login", { method: "POST", body: "{}" });

    const headers = new Headers(fetchMock.mock.calls[1][1]?.headers);
    expect(headers.get("X-XSRF-TOKEN")).toBe("api-csrf-token");
  });
});
