// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ComponentType } from "react";

import { getTheme, themes } from "@/data/themes";
import type { DedicatedTemplateProps } from "../../WeddingFullPage";
import { RomanticTemplate } from "@/features/templates/catalog/romantic/RomanticTemplate";
import { LuxuryTemplate } from "@/features/templates/catalog/luxury/LuxuryTemplate";
import { ModernTemplate } from "@/features/templates/catalog/modern/ModernTemplate";
import { MinimalTemplate } from "@/features/templates/catalog/minimal/MinimalTemplate";
import { RoyalTemplate } from "@/features/templates/catalog/royal/RoyalTemplate";
import { TraditionalTemplate } from "@/features/templates/catalog/traditional/TraditionalTemplate";
import { BotanicalTemplate as GardenTemplate } from "@/features/templates/catalog/botanical/BotanicalTemplate";
import { VintageTemplate } from "@/features/templates/catalog/vintage/VintageTemplate";
import { KoreanTemplate } from "@/features/templates/catalog/korean/KoreanTemplate";
import { EditorialTemplate as MagazineTemplate } from "@/features/templates/catalog/editorial/EditorialTemplate";
import { Flat2DTemplate } from "@/features/templates/catalog/flat2d/Flat2DTemplate";
import { LayeredTemplate } from "@/features/templates/catalog/layered3d/LayeredTemplate";
import { CosmicTemplate } from "../../../templates/catalog/cosmic/CosmicTemplate";
import { PixelTemplate } from "@/features/templates/catalog/pixel/PixelTemplate";
import { NordicAuroraTemplate } from "../../../templates/catalog/nordicaurora/NordicAuroraTemplate";
import { NeoTokyoTemplate } from "../../../templates/catalog/neotokyo/NeoTokyoTemplate";

/* List matches DEDICATED_TEMPLATES in WeddingFullPage.*/
/* The theme is obtained via getTheme(id) exactly as in production (without the theme id will fallback romantic).*/
const ALL_TEMPLATES: [string, ComponentType<DedicatedTemplateProps>][] = [
  ["romantic", RomanticTemplate],
  ["luxury", LuxuryTemplate],
  ["modern", ModernTemplate],
  ["minimalist", MinimalTemplate],
  ["royal", RoyalTemplate],
  ["traditional", TraditionalTemplate],
  ["garden", GardenTemplate],
  ["vintage", VintageTemplate],
  ["korean", KoreanTemplate],
  ["magazine", MagazineTemplate],
  ["flat2d", Flat2DTemplate],
  ["layered3d", LayeredTemplate],
  ["cosmic", CosmicTemplate],
  ["pixel", PixelTemplate],
  ["nordic_aurora", NordicAuroraTemplate],
  ["cyberpunk_luxe", NeoTokyoTemplate],
];

const baseProps = {
  groomName: "Minh",
  brideName: "Ha",
  date: "2099-12-31",
  time: "17:30",
  venue: "White Palace",
  address: "123 Nguyen Hue, District 1",
  message: "We look forward to welcoming you",
  rsvpEnabled: true,
  wishesEnabled: true,
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("dedicated templates — render safety", () => {
  it.each(ALL_TEMPLATES)("%s renders without throwing", (id, Template) => {
    expect(() => {
      render(<Template {...baseProps} theme={getTheme(id)} />);
    }).not.toThrow();
  });

  it.each(ALL_TEMPLATES)("%s unmounts without leaking render errors", (id, Template) => {
    const { unmount } = render(<Template {...baseProps} theme={getTheme(id)} />);
    expect(() => unmount()).not.toThrow();
  });
});

describe("MinimalTemplate — per-spec behaviour", () => {
  const renderRevealed = (overrides: Partial<DedicatedTemplateProps> = {}) => {
    return render(<MinimalTemplate {...baseProps} theme={themes.minimalist} {...overrides} />);
  };

  it("shows RSVP section only when rsvpEnabled (Property 3)", () => {
    renderRevealed({ rsvpEnabled: true });
    expect(screen.getAllByText("RSVP").length).toBeGreaterThan(0);
    cleanup();

    renderRevealed({ rsvpEnabled: false });
    expect(screen.queryByText("RSVP")).toBeNull();
  });

  it("shows WishesWall section only when wishesEnabled (Property 4)", () => {
    const { container } = renderRevealed({ wishesEnabled: true });
    expect(container.querySelector("#wishes")).not.toBeNull();
    cleanup();

    const hidden = renderRevealed({ wishesEnabled: false });
    expect(hidden.container.querySelector("#wishes")).toBeNull();
  });

  it("does not render Dress Code or FAQ sections (Requirement 5.5)", () => {
    renderRevealed();
    expect(screen.queryByText(/dress code/i)).toBeNull();
    expect(screen.queryByText("Information")).toBeNull();
  });

  it("renders couple names via the typography hero (Requirement 5.2)", () => {
    renderRevealed();
    expect(screen.getAllByText(/Minh/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ha/).length).toBeGreaterThan(0);
  });
});
