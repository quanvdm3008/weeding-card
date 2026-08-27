import { describe, expect, it } from "vitest";
import { safeLinkUrl, safeMediaUrl } from "./safeUrl";

describe("safeLinkUrl", () => {
  it("allows web, contact and relative links", () => {
    expect(safeLinkUrl("https://example.com/path")).toBe("https://example.com/path");
    expect(safeLinkUrl("mailto:hello@example.com")).toBe("mailto:hello@example.com");
    expect(safeLinkUrl("tel:+84123456789")).toBe("tel:+84123456789");
    expect(safeLinkUrl("/invitation/demo")).toBe("/invitation/demo");
  });

  it("rejects executable and malformed schemes", () => {
    expect(safeLinkUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeLinkUrl("java\nscript:alert(1)")).toBeUndefined();
    expect(safeLinkUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
  });
});

describe("safeMediaUrl", () => {
  it("allows hosted, blob and raster data media", () => {
    expect(safeMediaUrl("https://cdn.example.com/photo.webp")).toBe("https://cdn.example.com/photo.webp");
    expect(safeMediaUrl("blob:https://example.com/asset-id")).toBe("blob:https://example.com/asset-id");
    expect(safeMediaUrl("data:image/png;base64,iVBORw0KGgo=")).toBe("data:image/png;base64,iVBORw0KGgo=");
  });

  it("rejects active data and executable URLs", () => {
    expect(safeMediaUrl("data:image/svg+xml,<svg onload=alert(1) />")).toBeUndefined();
    expect(safeMediaUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeMediaUrl("javascript:alert(1)")).toBeUndefined();
  });
});
