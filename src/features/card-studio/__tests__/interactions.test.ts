import { describe, expect, it } from "vitest";
import { computeSnap, rectsIntersect, resizeRect, rotationFromPointer, snapToGrid } from "../canvas/interactions";

describe("canvas interactions", () => {
  it("snapToGrid rounds to a multiple of 8", () => {
    expect(snapToGrid(13)).toBe(16);
    expect(snapToGrid(11)).toBe(8);
    expect(snapToGrid(0)).toBe(0);
  });

  it("computeSnap sucks the left edge to the right edge of the other rect in the threshold", () => {
    const moving = { x: 204, y: 50, width: 100, height: 40 };
    const other = { x: 100, y: 300, width: 100, height: 40 }; /* right edge = 200*/
    const snap = computeSnap(moving, [other], 800, 600, "s1", 6);
    expect(snap.dx).toBe(-4); // 204 → 200
    expect(snap.guides.some((g) => g.orientation === "v" && g.position === 200)).toBe(true);
  });

  it("computeSnap sucks the center of the component to the center of the section", () => {
    const moving = { x: 348, y: 50, width: 100, height: 40 }; /* center x = 398, center section = 400*/
    const snap = computeSnap(moving, [], 800, 600, "s1", 6);
    expect(snap.dx).toBe(2);
    expect(snap.guides.some((g) => g.orientation === "v" && g.position === 400)).toBe(true);
  });

  it("computeSnap does not suck beyond the threshold", () => {
    const moving = { x: 250, y: 250, width: 20, height: 20 };
    const snap = computeSnap(moving, [], 800, 600, "s1", 5);
    expect(snap.dx).toBe(0);
    expect(snap.dy).toBe(0);
    expect(snap.guides).toHaveLength(0);
  });

  it("resizeRect handle will increase the size, keeping the upper left corner", () => {
    const r = resizeRect({ x: 10, y: 10, width: 100, height: 50 }, "se", 20, 10, false);
    expect(r).toEqual({ x: 10, y: 10, width: 120, height: 60 });
  });

  it("resizeRect handle nw keeps the bottom right corner fixed", () => {
    const r = resizeRect({ x: 10, y: 10, width: 100, height: 50 }, "nw", 20, 10, false);
    expect(r.x + r.width).toBe(110);
    expect(r.y + r.height).toBe(60);
    expect(r.width).toBe(80);
  });

  it("resizeRect is not smaller than the minimum size", () => {
    const r = resizeRect({ x: 0, y: 0, width: 40, height: 40 }, "se", -100, -100, false);
    expect(r.width).toBeGreaterThanOrEqual(16);
    expect(r.height).toBeGreaterThanOrEqual(16);
  });

  it("resizeRect preserveAspect preserves the aspect ratio at the corner handle", () => {
    const r = resizeRect({ x: 0, y: 0, width: 200, height: 100 }, "se", 100, 0, true);
    expect(r.width / r.height).toBeCloseTo(2, 5);
  });

  it("rotationFromPointer snaps in 15° increments while holding shift", () => {
    /* cross cursor 45° from center → no shift ~135, shift → multiple 15*/
    const angle = rotationFromPointer({ x: 0, y: 0 }, { x: 10, y: 10 }, true);
    expect(angle % 15).toBe(0);
  });

  it("rectsIntersect is true for intersection/non-intersection", () => {
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 0, width: 5, height: 5 })).toBe(false);
  });
});
