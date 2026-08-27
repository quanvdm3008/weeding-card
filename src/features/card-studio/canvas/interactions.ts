/**
 * Interactive math canvas — pure, no React: snap-to-grid, smart guides, resize.
 * Coordinates in the "design space" of the section (design px, not zoomed).
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SnapLine {
  orientation: "v" | "h";
  /** coordinates in section (v → x, h → y) */
  position: number;
  sectionId: string;
}

export const GRID_SIZE = 8;

export function snapToGrid(value: number, grid = GRID_SIZE): number {
  return Math.round(value / grid) * grid;
}

interface SnapResult {
  dx: number;
  dy: number;
  guides: SnapLine[];
}

/**
 * Smart guides: attracts the edge/center of the rect being dragged to the edge/center of other rects
 * and section border/center. Returns the correction (dx,dy) + list of guides to draw.
 */
export function computeSnap(
  moving: Rect,
  others: Rect[],
  sectionWidth: number,
  sectionHeight: number,
  sectionId: string,
  threshold: number
): SnapResult {
  const vTargets: number[] = [0, sectionWidth / 2, sectionWidth];
  const hTargets: number[] = [0, sectionHeight / 2, sectionHeight];
  for (const r of others) {
    vTargets.push(r.x, r.x + r.width / 2, r.x + r.width);
    hTargets.push(r.y, r.y + r.height / 2, r.y + r.height);
  }

  const movingV = [moving.x, moving.x + moving.width / 2, moving.x + moving.width];
  const movingH = [moving.y, moving.y + moving.height / 2, moving.y + moving.height];

  let bestDx: number | null = null;
  let bestVLine = 0;
  for (const target of vTargets) {
    for (const edge of movingV) {
      const delta = target - edge;
      if (Math.abs(delta) <= threshold && (bestDx === null || Math.abs(delta) < Math.abs(bestDx))) {
        bestDx = delta;
        bestVLine = target;
      }
    }
  }

  let bestDy: number | null = null;
  let bestHLine = 0;
  for (const target of hTargets) {
    for (const edge of movingH) {
      const delta = target - edge;
      if (Math.abs(delta) <= threshold && (bestDy === null || Math.abs(delta) < Math.abs(bestDy))) {
        bestDy = delta;
        bestHLine = target;
      }
    }
  }

  const guides: SnapLine[] = [];
  if (bestDx !== null) guides.push({ orientation: "v", position: bestVLine, sectionId });
  if (bestDy !== null) guides.push({ orientation: "h", position: bestHLine, sectionId });
  return { dx: bestDx ?? 0, dy: bestDy ?? 0, guides };
}

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const MIN_SIZE = 16;

/** Resize rect by handle; keep proportion when preserveAspect (angle handle). */
export function resizeRect(
  start: Rect,
  handle: ResizeHandle,
  dx: number,
  dy: number,
  preserveAspect: boolean
): Rect {
  let { x, y, width, height } = start;

  const west = handle.includes("w");
  const east = handle.includes("e");
  const north = handle.includes("n");
  const south = handle.includes("s");

  if (east) width = Math.max(MIN_SIZE, start.width + dx);
  if (south) height = Math.max(MIN_SIZE, start.height + dy);
  if (west) {
    width = Math.max(MIN_SIZE, start.width - dx);
    x = start.x + (start.width - width);
  }
  if (north) {
    height = Math.max(MIN_SIZE, start.height - dy);
    y = start.y + (start.height - height);
  }

  const isCorner = (west || east) && (north || south);
  if (preserveAspect && isCorner && start.width > 0 && start.height > 0) {
    const ratio = start.width / start.height;
    /* Prioritize the direction of change more*/
    if (Math.abs(width - start.width) >= Math.abs(height - start.height) * ratio) {
      height = Math.max(MIN_SIZE, width / ratio);
    } else {
      width = Math.max(MIN_SIZE, height * ratio);
    }
    if (west) x = start.x + (start.width - width);
    if (north) y = start.y + (start.height - height);
  }

  return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
}

/** Rotation angle (degrees) from rect center to mouse point; shift → 15° multiple. */
export function rotationFromPointer(
  center: { x: number; y: number },
  pointer: { x: number; y: number },
  snap15: boolean
): number {
  const angle = (Math.atan2(pointer.y - center.y, pointer.x - center.x) * 180) / Math.PI + 90;
  const normalized = ((angle % 360) + 360) % 360;
  const result = snap15 ? Math.round(normalized / 15) * 15 : Math.round(normalized);
  return result % 360;
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
