import { describe, expect, it } from "vitest";
import { translateApiError } from "./translations";

describe("API error translations", () => {
  it("uses the stable backend code instead of its message", () => {
    expect(translateApiError("EMAIL_ALREADY_USED", "vi", "ignored")).toBe("Email is already in use");
    expect(translateApiError("EMAIL_ALREADY_USED", "en", "ignored")).toBe("Email is already in use");
  });
});
