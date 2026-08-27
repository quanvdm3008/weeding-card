import { describe, expect, it } from "vitest";
import {
  GALLERY_ITEM_REVEAL_DURATION_SECONDS,
  IMAGE_REVEAL_DURATION_SECONDS,
} from "../animationTiming";

describe("shared image animation timing", () => {
  it("keeps photos visible long enough to read their reveal", () => {
    expect(IMAGE_REVEAL_DURATION_SECONDS).toBe(1.6);
    expect(GALLERY_ITEM_REVEAL_DURATION_SECONDS).toBe(1.2);
  });
});
