// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GalleryFilmStrip from "../GalleryFilmStrip";
import GalleryDispatcher from "../GalleryDispatcher";
import { GALLERY_FILMSTRIP_AUTOPLAY_INTERVAL_MS } from "@/lib/animationTiming";
import { themes } from "@/data/themes";

describe("GalleryFilmStrip autoplay", () => {
  beforeEach(() => vi.useFakeTimers());

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("advances a multi-image rail without manual input", () => {
    render(<GalleryFilmStrip images={["/one.jpg", "/two.jpg", "/three.jpg"]} accentColor="#D4AF37" />);
    const rail = screen.getByTestId("gallery-filmstrip-rail");

    Object.defineProperties(rail, {
      clientWidth: { configurable: true, value: 600 },
      scrollWidth: { configurable: true, value: 1500 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollTo: {
        configurable: true,
        value: vi.fn(({ left }: ScrollToOptions) => { rail.scrollLeft = Number(left); }),
      },
    });

    act(() => vi.advanceTimersByTime(GALLERY_FILMSTRIP_AUTOPLAY_INTERVAL_MS));

    expect(rail.scrollLeft).toBeGreaterThan(0);
  });

  it("does not reset autoplay when the invitation countdown rerenders its parent", () => {
    const props = { theme: themes.luxury, accentColor: "#D4AF37", images: ["/one.jpg", "/two.jpg", "/three.jpg"] };
    const { rerender } = render(<GalleryDispatcher {...props} />);
    const rail = screen.getByTestId("gallery-filmstrip-rail");
    Object.defineProperties(rail, {
      clientWidth: { configurable: true, value: 600 },
      scrollWidth: { configurable: true, value: 1500 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollTo: { configurable: true, value: vi.fn(({ left }: ScrollToOptions) => { rail.scrollLeft = Number(left); }) },
    });

    act(() => vi.advanceTimersByTime(4000));
    rerender(<GalleryDispatcher {...props} />);
    act(() => vi.advanceTimersByTime(GALLERY_FILMSTRIP_AUTOPLAY_INTERVAL_MS - 4000));

    expect(rail.scrollLeft).toBeGreaterThan(0);
  });
});
